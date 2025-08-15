import { model } from "@medusajs/framework/utils"

export const ProductImage = model.define("product_image", {
  id: model.id().primaryKey(),
  product_id: model.text(), // Foreign key to product
  url: model.text(), // Full URL to the image
  file_name: model.text(), // Original file name
  file_path: model.text(), // Storage path (local or cloud)
  file_size: model.number(), // File size in bytes
  mime_type: model.text(), // e.g., "image/jpeg", "image/png"
  width: model.number().nullable(), // Image width in pixels
  height: model.number().nullable(), // Image height in pixels
  alt_text: model.text().nullable(), // Alt text for accessibility
  is_primary: model.boolean().default(false), // Primary image for product
  sort_order: model.number().default(0), // Order for display
  thumbnail_url: model.text().nullable(), // Thumbnail version URL
  medium_url: model.text().nullable(), // Medium size version URL
  storage_provider: model.text().default("local"), // "local", "s3", "cloudinary", etc.
  metadata: model.text().nullable(), // JSON string for additional metadata
  uploaded_by: model.text().nullable(), // User ID who uploaded
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})
