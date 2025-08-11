import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import VendorService from "../../../services/vendor"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    console.log("Custom vendors GET request received")
    
    let vendorService: VendorService
    try {
      vendorService = req.scope.resolve("vendorService") as VendorService
      console.log("VendorService resolved successfully")
    } catch (resolveError) {
      console.log("Failed to resolve vendorService, creating new instance:", resolveError.message)
      vendorService = new VendorService(req.scope)
    }
    
    const vendors = await vendorService.list()
    console.log("Custom vendors retrieved:", vendors.length)
    
    // Set CORS headers for frontend access
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    res.json({
      vendors
    })
  } catch (error) {
    console.error("Custom vendors error:", error)
    res.status(500).json({ error: error.message })
  }
}

export async function OPTIONS(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200).end()
}
