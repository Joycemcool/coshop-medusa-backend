import { Pool } from 'pg'
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"

export interface ImageUploadOptions {
  productId: string
  file: Buffer
  fileName: string
  mimeType: string
  uploadedBy?: string
  altText?: string
  isPrimary?: boolean
}

export interface ImageProcessingOptions {
  thumbnail?: { width: number; height: number }
  medium?: { width: number; height: number }
  quality?: number
}

export interface ImageMetadata {
  width: number
  height: number
  format: string
  size: number
}

type ProductImageData = {
  id?: string
  product_id: string
  url: string
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  width?: number
  height?: number
  alt_text?: string
  is_primary?: boolean
  sort_order?: number
  thumbnail_url?: string
  medium_url?: string
  storage_provider?: string
  metadata?: string
  uploaded_by?: string
}

export default class ImageUploadService {
  protected readonly container_
  private pool: Pool
  private uploadDir = process.env.IMAGE_UPLOAD_DIR || "./uploads/images"
  private baseUrl = process.env.IMAGE_BASE_URL || "http://localhost:9000/uploads/images"

  constructor(container) {
    this.container_ = container
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })
    this.ensureUploadDirectory()
  }

  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true })
    }
    
    // Create subdirectories for different sizes
    const subdirs = ["original", "thumbnail", "medium"]
    subdirs.forEach(subdir => {
      const dirPath = path.join(this.uploadDir, subdir)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
    })
  }

  async uploadProductImage(options: ImageUploadOptions): Promise<any> {
    const { productId, file, fileName, mimeType, uploadedBy, altText, isPrimary = false } = options

    // Generate unique file ID
    const fileId = uuidv4()
    const fileExtension = path.extname(fileName) || this.getExtensionFromMimeType(mimeType)
    const baseFileName = `${fileId}${fileExtension}`

    // Process and save images in different sizes
    const imageVersions = await this.processImage(file, baseFileName)
    
    // Get image metadata (basic version without sharp for now)
    const metadata = this.getBasicImageMetadata(file)

    // If this is set as primary, update existing primary images for this product
    if (isPrimary) {
      await this.updatePrimaryImages(productId, false)
    }

    // Save to database
    const now = new Date()
    const result = await this.pool.query(`
      INSERT INTO product_image (
        id, product_id, url, file_name, file_path, file_size, mime_type,
        width, height, alt_text, is_primary, sort_order, thumbnail_url,
        medium_url, storage_provider, uploaded_by, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING *
    `, [
      fileId, productId, imageVersions.original.url, fileName, imageVersions.original.path,
      metadata.size, mimeType, metadata.width, metadata.height, altText, isPrimary,
      await this.getNextSortOrder(productId), imageVersions.thumbnail.url,
      imageVersions.medium.url, "local", uploadedBy, now, now
    ])

    return result.rows[0]
  }

  private async processImage(buffer: Buffer, fileName: string): Promise<{
    original: { path: string; url: string }
    thumbnail: { path: string; url: string }
    medium: { path: string; url: string }
  }> {
    const originalPath = path.join(this.uploadDir, "original", fileName)
    const thumbnailPath = path.join(this.uploadDir, "thumbnail", fileName)
    const mediumPath = path.join(this.uploadDir, "medium", fileName)

    // For now, just save the original file
    // TODO: Add sharp for image processing
    fs.writeFileSync(originalPath, buffer)
    fs.writeFileSync(thumbnailPath, buffer) // Copy original for now
    fs.writeFileSync(mediumPath, buffer) // Copy original for now

    return {
      original: {
        path: originalPath,
        url: `${this.baseUrl}/original/${fileName}`
      },
      thumbnail: {
        path: thumbnailPath,
        url: `${this.baseUrl}/thumbnail/${fileName}`
      },
      medium: {
        path: mediumPath,
        url: `${this.baseUrl}/medium/${fileName}`
      }
    }
  }

  private getBasicImageMetadata(buffer: Buffer): ImageMetadata {
    // Basic metadata without sharp dependency
    return {
      width: 0, // Will need sharp or another library for actual dimensions
      height: 0,
      format: "unknown",
      size: buffer.length
    }
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const extensions = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg", 
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif"
    }
    return extensions[mimeType] || ".jpg"
  }

  private async updatePrimaryImages(productId: string, isPrimary: boolean) {
    await this.pool.query(
      'UPDATE product_image SET is_primary = $1 WHERE product_id = $2',
      [isPrimary, productId]
    )
  }

  private async getNextSortOrder(productId: string): Promise<number> {
    const result = await this.pool.query(
      'SELECT MAX(sort_order) as max_order FROM product_image WHERE product_id = $1',
      [productId]
    )
    
    const maxOrder = result.rows[0]?.max_order || 0
    return maxOrder + 1
  }

  async getProductImages(productId: string) {
    const result = await this.pool.query(`
      SELECT * FROM product_image 
      WHERE product_id = $1 
      ORDER BY is_primary DESC, sort_order ASC
    `, [productId])
    
    return result.rows
  }

  async deleteProductImage(imageId: string) {
    // Get image info first
    const result = await this.pool.query(
      'SELECT * FROM product_image WHERE id = $1',
      [imageId]
    )

    if (result.rows.length === 0) {
      throw new Error("Image not found")
    }

    const image = result.rows[0]

    // Delete physical files
    const filesToDelete = [
      image.file_path,
      image.thumbnail_url?.replace(this.baseUrl, this.uploadDir),
      image.medium_url?.replace(this.baseUrl, this.uploadDir)
    ].filter(Boolean)

    for (const filePath of filesToDelete) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    // Delete from database
    await this.pool.query('DELETE FROM product_image WHERE id = $1', [imageId])
    
    return { success: true }
  }

  async updateImageOrder(productId: string, imageOrders: { id: string; sortOrder: number }[]) {
    for (const order of imageOrders) {
      await this.pool.query(
        'UPDATE product_image SET sort_order = $1 WHERE id = $2 AND product_id = $3',
        [order.sortOrder, order.id, productId]
      )
    }
    
    return await this.getProductImages(productId)
  }

  async setPrimaryImage(productId: string, imageId: string) {
    // Remove primary flag from all images for this product
    await this.updatePrimaryImages(productId, false)
    
    // Set the specified image as primary
    await this.pool.query(
      'UPDATE product_image SET is_primary = true WHERE id = $1 AND product_id = $2',
      [imageId, productId]
    )
    
    return await this.getProductImages(productId)
  }

  async retrieve(imageId: string) {
    const result = await this.pool.query(
      'SELECT * FROM product_image WHERE id = $1',
      [imageId]
    )
    
    if (result.rows.length === 0) {
      throw new Error(`Image with id ${imageId} not found`)
    }
    
    return result.rows[0]
  }

  async list() {
    const result = await this.pool.query('SELECT * FROM product_image ORDER BY created_at DESC')
    return result.rows
  }
}
