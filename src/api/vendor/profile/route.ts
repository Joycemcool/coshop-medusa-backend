import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import jwt from "jsonwebtoken"
import VendorService from "../../../services/vendor"

// Vendor profile update schema
const vendorProfileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  farm_name: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  description: z.string().optional(),
  category: z.string().min(2).optional(),
  phone: z.string().optional(),
  farm_logo: z.string().optional(),
})

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
  res.header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.header("Access-Control-Allow-Credentials", "true")
  res.status(200).end()
}

// GET vendor profile
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // Set CORS headers
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.header("Access-Control-Allow-Credentials", "true")
    
    console.log("Get vendor profile request received")
    
    // Verify vendor authentication
    const vendorId = verifyVendorToken(req)
    if (!vendorId) {
      return res.status(401).json({
        error: "Unauthorized - Invalid or missing token"
      })
    }

    // Get vendor service
    let vendorService
    try {
      vendorService = req.scope.resolve("vendorService")
    } catch (error) {
      vendorService = new VendorService(req.scope)
    }

    // Get vendor details
    const vendor = await vendorService.retrieve(vendorId)
    if (!vendor) {
      return res.status(404).json({
        error: "Vendor not found"
      })
    }

    res.status(200).json({
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        farm_name: vendor.farm_name,
        location: vendor.location,
        description: vendor.description,
        category: vendor.category,
        phone: vendor.phone,
        farm_logo: vendor.farm_logo,
        commission_rate: vendor.commission_rate,
        is_active: vendor.is_active,
      }
    })

  } catch (error) {
    console.error("Get vendor profile error:", error)
    res.status(500).json({
      error: "Failed to get profile",
      message: error.message
    })
  }
}

// PUT/PATCH vendor profile
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // Set CORS headers
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.header("Access-Control-Allow-Credentials", "true")
    
    console.log("Update vendor profile request received")
    
    // Verify vendor authentication
    const vendorId = verifyVendorToken(req)
    if (!vendorId) {
      return res.status(401).json({
        error: "Unauthorized - Invalid or missing token"
      })
    }

    // Validate request body
    const updateData = vendorProfileUpdateSchema.parse(req.body)

    // Get vendor service
    let vendorService
    try {
      vendorService = req.scope.resolve("vendorService")
    } catch (error) {
      vendorService = new VendorService(req.scope)
    }

    // Update vendor profile
    const updatedVendor = await vendorService.update(vendorId, updateData)

    console.log("Vendor profile updated:", vendorId)

    res.status(200).json({
      message: "Profile updated successfully",
      vendor: {
        id: updatedVendor.id,
        name: updatedVendor.name,
        email: updatedVendor.email,
        farm_name: updatedVendor.farm_name,
        location: updatedVendor.location,
        description: updatedVendor.description,
        category: updatedVendor.category,
        phone: updatedVendor.phone,
        farm_logo: updatedVendor.farm_logo,
        commission_rate: updatedVendor.commission_rate,
        is_active: updatedVendor.is_active,
      }
    })

  } catch (error) {
    console.error("Update vendor profile error:", error)
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors
      })
    }

    res.status(500).json({
      error: "Failed to update profile",
      message: error.message
    })
  }
}
