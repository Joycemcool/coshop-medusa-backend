import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import VendorService from "../../../services/vendor"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    console.log("Store vendors GET request received")
    
    let vendorService: VendorService
    try {
      vendorService = req.scope.resolve("vendorService") as VendorService
      console.log("VendorService resolved successfully")
    } catch (resolveError) {
      console.log("Failed to resolve vendorService, creating new instance:", resolveError.message)
      vendorService = new VendorService(req.scope)
    }
    
    const vendors = await vendorService.list()
    console.log("Store vendors retrieved:", vendors.length)
    
    res.json({
      vendors
    })
  } catch (error) {
    console.error("Store vendors error:", error)
    res.status(500).json({ error: error.message })
  }
}
