import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import VendorService from "../../../../services/vendor"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params
    console.log(`Store vendor by ID request received for: ${id}`)
    
    let vendorService: VendorService
    try {
      vendorService = req.scope.resolve("vendorService") as VendorService
      console.log("VendorService resolved successfully")
    } catch (resolveError) {
      console.log("Failed to resolve vendorService, creating new instance:", resolveError.message)
      vendorService = new VendorService(req.scope)
    }
    
    const vendor = await vendorService.retrieve(id)
    
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" })
    }
    
    console.log("Store vendor retrieved:", vendor.name)
    
    // Set CORS headers for frontend access
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-publishable-api-key')
    
    res.json({
      vendor
    })
  } catch (error) {
    console.error("Store vendor by ID error:", error)
    res.status(500).json({ error: error.message })
  }
}
