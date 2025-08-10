import { model } from "@medusajs/framework/utils"

export const Product = model.define("product", {
  id: model.id().primaryKey(),
  vendor_id: model.text().nullable(),
  vendor_price: model.number().nullable(),
  platform_commission: model.number().nullable(),
  vendor_approved: model.boolean().default(false),
})
