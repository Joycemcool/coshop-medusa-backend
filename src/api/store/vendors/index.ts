import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import VendorService from "../../../services/vendor"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const vendorService: VendorService = req.scope.resolve("vendorService")
    const vendors = await vendorService.list()
    
    const activeVendors = vendors.filter(vendor => vendor.is_active)
    
    res.json({
      vendors: activeVendors
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
