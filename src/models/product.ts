import { model } from "@medusajs/framework/utils"

export const Product = model.define("product", {
  id: model.id().primaryKey(),
  vendor_id: model.text().nullable(),
  vendor_price: model.number().nullable(),
  platform_commission: model.number().nullable(),
  vendor_approved: model.boolean().default(false),
  vendor_name: model.text().nullable(),
  vendor_sku: model.text().nullable(),
  organic_certified: model.boolean().default(false),
  harvest_date: model.dateTime().nullable(),
  expiry_date: model.dateTime().nullable(),
  storage_instructions: model.text().nullable(),
  nutritional_info: model.text().nullable(), // JSON string
  farm_practice: model.text().nullable(), // e.g., "organic", "conventional", "pesticide-free"
  availability_status: model.text().default("available"), // "available", "limited", "pre-order", "out-of-season"
  minimum_order_quantity: model.number().default(1),
  bulk_pricing: model.text().nullable(), // JSON string for bulk pricing tiers
  seasonal_availability: model.text().nullable(), // JSON string for seasonal info
  vendor_notes: model.text().nullable(),
  quality_grade: model.text().nullable(), // e.g., "A", "B", "Premium"
  origin_location: model.text().nullable(),
  delivery_available: model.boolean().default(true),
  pickup_available: model.boolean().default(true),
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})
