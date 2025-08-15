# Co-Shop Image Upload System

## Overview

This document describes the comprehensive image upload and management system for the Co-Shop platform. The system supports uploading, storing, and serving product images with automatic thumbnail generation and multiple storage options.

## Features

- **Image Upload**: Upload single or multiple images for products
- **Multiple Sizes**: Automatic generation of thumbnail and medium-sized versions
- **Metadata Management**: Store image metadata including dimensions, file size, and alt text
- **Primary Image**: Set primary image for products
- **Image Ordering**: Custom sort order for product images
- **Storage Options**: Support for local storage with extensibility for cloud providers
- **RESTful API**: Complete REST API for image management

## Database Schema

### ProductImage Model

```sql
CREATE TABLE "product_image" (
  "id" varchar NOT NULL,
  "product_id" varchar NOT NULL,
  "url" varchar NOT NULL,
  "file_name" varchar NOT NULL,
  "file_path" varchar NOT NULL,
  "file_size" integer NOT NULL,
  "mime_type" varchar NOT NULL,
  "width" integer NULL,
  "height" integer NULL,
  "alt_text" varchar NULL,
  "is_primary" boolean NOT NULL DEFAULT false,
  "sort_order" integer NOT NULL DEFAULT 0,
  "thumbnail_url" varchar NULL,
  "medium_url" varchar NULL,
  "storage_provider" varchar NOT NULL DEFAULT 'local',
  "metadata" text NULL,
  "uploaded_by" varchar NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);
```

### Indexes
- `IDX_product_image_product_id` - For querying images by product
- `IDX_product_image_is_primary` - For finding primary images
- `IDX_product_image_sort_order` - For ordering images

## API Endpoints

### Upload Image
**POST** `/custom/products/{product_id}/images`

Upload a single image for a product.

**Request Body:**
```json
{
  "image_data": "base64-encoded-image-data",
  "file_name": "image.jpg",
  "mime_type": "image/jpeg",
  "alt_text": "Product image description",
  "is_primary": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "product_id": "product_123",
    "url": "http://localhost:9000/uploads/images/original/uuid.jpg",
    "file_name": "image.jpg",
    "file_size": 152400,
    "mime_type": "image/jpeg",
    "width": 800,
    "height": 600,
    "alt_text": "Product image description",
    "is_primary": true,
    "sort_order": 0,
    "thumbnail_url": "http://localhost:9000/uploads/images/thumbnail/uuid.jpg",
    "medium_url": "http://localhost:9000/uploads/images/medium/uuid.jpg",
    "storage_provider": "local",
    "created_at": "2025-01-13T10:00:00Z",
    "updated_at": "2025-01-13T10:00:00Z"
  }
}
```

### Get Product Images
**GET** `/custom/products/{product_id}/images`

Retrieve all images for a product.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "product_id": "product_123",
      "url": "http://localhost:9000/uploads/images/original/uuid.jpg",
      "is_primary": true,
      "sort_order": 0,
      ...
    }
  ],
  "count": 1
}
```

### Get Specific Image
**GET** `/custom/products/{product_id}/images/{image_id}`

Retrieve a specific image by ID.

### Delete Image
**DELETE** `/custom/products/{product_id}/images/{image_id}`

Delete a specific image and its files.

### Update Image
**PATCH** `/custom/products/{product_id}/images/{image_id}`

Update image metadata (currently supports setting primary image).

**Request Body:**
```json
{
  "is_primary": true
}
```

### Update Image Order
**PATCH** `/custom/products/{product_id}/images/bulk`

Update the sort order of multiple images.

**Request Body:**
```json
{
  "image_orders": [
    { "id": "uuid1", "sortOrder": 0 },
    { "id": "uuid2", "sortOrder": 1 },
    { "id": "uuid3", "sortOrder": 2 }
  ]
}
```

### Serve Images
**GET** `/custom/uploads/images/{size}/{filename}`

Serve image files directly.

- `size`: original, thumbnail, medium
- `filename`: actual filename with extension

## Storage Configuration

### Local Storage (Default)

Images are stored in the local filesystem under `./uploads/images/` with subdirectories:
- `original/` - Full-size images
- `thumbnail/` - 150x150 thumbnails
- `medium/` - 400x400 medium-sized images

### Environment Variables

```env
# Local storage directory
IMAGE_UPLOAD_DIR=./uploads/images

# Base URL for serving images
IMAGE_BASE_URL=http://localhost:9000/uploads/images

# Storage provider
STORAGE_PROVIDER=local

# Image processing settings
THUMBNAIL_SIZE=150x150
MEDIUM_SIZE=400x400
IMAGE_QUALITY=85
```

## Service Layer

### ImageUploadService

The `ImageUploadService` provides the following methods:

#### `uploadProductImage(options: ImageUploadOptions)`
Uploads and processes a single image for a product.

#### `getProductImages(productId: string)`
Retrieves all images for a product, ordered by primary status and sort order.

#### `deleteProductImage(imageId: string)`
Deletes an image and its associated files.

#### `updateImageOrder(productId: string, imageOrders: [])`
Updates the sort order of multiple images.

#### `setPrimaryImage(productId: string, imageId: string)`
Sets a specific image as the primary image for a product.

## Usage Examples

### Frontend Integration

```javascript
// Upload image
const uploadImage = async (productId, imageFile, options = {}) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  if (options.altText) formData.append('alt_text', options.altText);
  if (options.isPrimary) formData.append('is_primary', 'true');

  const response = await fetch(`/api/custom/products/${productId}/images`, {
    method: 'POST',
    body: formData
  });

  return response.json();
};

// Get product images
const getProductImages = async (productId) => {
  const response = await fetch(`/api/custom/products/${productId}/images`);
  return response.json();
};

// Set primary image
const setPrimaryImage = async (productId, imageId) => {
  const response = await fetch(`/api/custom/products/${productId}/images/${imageId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_primary: true })
  });
  return response.json();
};
```

### Base64 Upload (Current Implementation)

```javascript
// Convert file to base64 and upload
const uploadImageBase64 = async (productId, file, options = {}) => {
  const base64 = await fileToBase64(file);
  
  const response = await fetch(`/api/custom/products/${productId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_data: base64,
      file_name: file.name,
      mime_type: file.type,
      alt_text: options.altText,
      is_primary: options.isPrimary
    })
  });

  return response.json();
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};
```

## Migration

To set up the image system, run the migration:

```bash
npm run migration:run
```

This will create the `product_image` table with all necessary indexes.

## Future Enhancements

1. **Image Processing**: Add sharp library for advanced image processing
2. **Cloud Storage**: Implement AWS S3 and Cloudinary providers
3. **Image Optimization**: Add WebP conversion and automatic compression
4. **CDN Integration**: Support for CDN delivery
5. **Bulk Upload**: Enhanced bulk upload with progress tracking
6. **Image Validation**: Advanced validation for image dimensions and quality
7. **Watermarking**: Optional watermark support
8. **Image Analytics**: Track image performance and usage

## Security Considerations

1. **File Type Validation**: Only allow specific image mime types
2. **File Size Limits**: Enforce maximum file size limits
3. **File Name Sanitization**: Sanitize uploaded file names
4. **Storage Security**: Secure file storage with proper permissions
5. **Rate Limiting**: Implement rate limiting for upload endpoints
6. **Authentication**: Ensure proper authentication for upload operations

## Troubleshooting

### Common Issues

1. **File not found**: Check IMAGE_UPLOAD_DIR path and permissions
2. **Upload fails**: Verify file size and mime type restrictions
3. **Images not serving**: Check IMAGE_BASE_URL configuration
4. **Database errors**: Ensure migration has been run

### Error Codes

- `400`: Invalid request (missing parameters, invalid file type)
- `404`: Image or product not found
- `413`: File too large
- `500`: Server error (storage, database, or processing failure)

This image upload system provides a robust foundation for managing product images in the Co-Shop platform with room for future enhancements and scaling.
