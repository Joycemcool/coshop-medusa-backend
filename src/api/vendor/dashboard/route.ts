import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import jwt from "jsonwebtoken"
import VendorService from "../../../services/vendor"

// Middleware to verify vendor JWT token
function verifyVendorToken(req: MedusaRequest): string | null {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const jwtSecret = process.env.JWT_SECRET || "your-secret-key"
  
  try {
    const decoded = jwt.verify(token, jwtSecret) as any
    if (decoded.type !== 'vendor') {
      return null
    }
    return decoded.vendorId
  } catch (error) {
    return null
  }
}

export async function OPTIONS(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.header("Access-Control-Allow-Credentials", "true")
  res.status(200).end()
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // Set CORS headers
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*")
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.header("Access-Control-Allow-Credentials", "true")
    
    console.log("Vendor dashboard request received")
    
    // Verify vendor authentication
    const vendorId = verifyVendorToken(req)
    if (!vendorId) {
      return res.status(401).json({
        error: "Unauthorized - Invalid or missing token"
      })
    }

    // Get vendor service (with fallback)
    let vendorService
    try {
      vendorService = req.scope.resolve("vendorService")
    } catch (error) {
      console.log("Failed to resolve vendorService, creating new instance:", error.message)
      vendorService = new VendorService(req.scope)
    }

    // Get vendor details
    const vendor = await vendorService.retrieve(vendorId)
    if (!vendor) {
      return res.status(404).json({
        error: "Vendor not found"
      })
    }

    // Get vendor stats (mock data for now)
    const dashboardData = {
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        farm_name: vendor.farm_name,
        location: vendor.location,
        description: vendor.description,
        category: vendor.category,
        commission_rate: vendor.commission_rate,
        is_active: vendor.is_active,
      },
      stats: {
        totalProducts: 0, // TODO: Get from products table
        totalOrders: 0,   // TODO: Get from orders table
        totalRevenue: 0,  // TODO: Calculate from orders
        pendingOrders: 0  // TODO: Get pending orders count
      },
      recentActivity: [] // TODO: Get recent orders/activities
    }

    console.log("Vendor dashboard data retrieved for:", vendorId)

    res.status(200).json(dashboardData)

  } catch (error) {
    console.error("Vendor dashboard error:", error)
    res.status(500).json({
      error: "Failed to load dashboard",
      message: error.message
    })
  }
}
