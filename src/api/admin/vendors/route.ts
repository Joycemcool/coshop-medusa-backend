import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import VendorService from "../../../services/vendor"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const vendorService = req.scope.resolve("vendorService") as VendorService
    const vendors = await vendorService.list()
    
    res.json({
      vendors
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const vendorService = req.scope.resolve("vendorService") as VendorService
    const vendor = await vendorService.create(req.body as any)
    
    res.status(201).json({
      vendor
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
