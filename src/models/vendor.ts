import { model } from "@medusajs/framework/utils"

export const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  email: model.text().searchable(),
  name: model.text().searchable(),
  description: model.text().nullable(),
  phone: model.text().nullable(),
  address: model.text().nullable(),
  city: model.text().nullable(),
  state: model.text().nullable(),
  zip_code: model.text().nullable(),
  country: model.text().nullable(),
  farm_name: model.text().searchable().nullable(),
  farm_description: model.text().nullable(),
  farm_logo: model.text().nullable(),
  is_active: model.boolean().default(true),
  commission_rate: model.number().default(0),
  verified_at: model.dateTime().nullable(),
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})
