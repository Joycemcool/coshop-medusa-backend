import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import VendorService from "../../../services/vendor"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    console.log("Admin vendors GET request received")
    
    let vendorService: VendorService
    try {
      vendorService = req.scope.resolve("vendorService") as VendorService
      console.log("VendorService resolved successfully")
    } catch (resolveError) {
      console.log("Failed to resolve vendorService, creating new instance:", resolveError.message)
      vendorService = new VendorService(req.scope)
    }
    
    const vendors = await vendorService.list()
    console.log("Vendors retrieved:", vendors.length)
    
    res.json({
      vendors
    })
  } catch (error) {
    console.error("Admin vendors error:", error)
    res.status(500).json({ error: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    let vendorService: VendorService
    try {
      vendorService = req.scope.resolve("vendorService") as VendorService
    } catch (resolveError) {
      vendorService = new VendorService(req.scope)
    }
    
    const vendor = await vendorService.create(req.body as any)
    
    res.status(201).json({
      vendor
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    let vendorService: VendorService
    try {
      vendorService = req.scope.resolve("vendorService") as VendorService
    } catch (resolveError) {
      vendorService = new VendorService(req.scope)
    }
    
    // Delete all vendors
    const vendors = await vendorService.list()
    const results: any[] = []
    
    for (const vendor of vendors) {
      const result = await vendorService.delete(vendor.id)
      results.push(result)
    }
    
    res.json({
      message: `Deleted ${results.length} vendors`,
      deleted: results
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
