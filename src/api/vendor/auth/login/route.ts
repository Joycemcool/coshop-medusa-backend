import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import VendorService from "../../../../services/vendor"

// Vendor login schema
const vendorLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function OPTIONS(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.header("Access-Control-Allow-Credentials", "true")
  res.status(200).end()
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // Set CORS headers
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*")
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.header("Access-Control-Allow-Credentials", "true")
    
    console.log("Vendor login request received")
    
    // Validate request body
    const { email, password } = vendorLoginSchema.parse(req.body)
    
    // Get vendor service (with fallback)
    let vendorService
    try {
      vendorService = req.scope.resolve("vendorService")
    } catch (error) {
      console.log("Failed to resolve vendorService, creating new instance:", error.message)
      vendorService = new VendorService(req.scope)
    }

    // Find vendor by email
    const vendor = await vendorService.getByEmail(email)
    if (!vendor) {
      return res.status(401).json({
        error: "Invalid email or password"
      })
    }

    // Check if vendor is active/approved
    if (!vendor.is_active) {
      return res.status(403).json({
        error: "Your account is pending approval. Please contact support."
      })
    }

    // For now, we'll implement basic password checking
    // In production, you'd hash passwords and compare hashes
    // This is a simplified version for demo purposes
    if (password !== "vendor123") { // Demo password
      return res.status(401).json({
        error: "Invalid email or password"
      })
    }

    // Generate JWT token for vendor session
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key"
    const token = jwt.sign(
      { 
        vendorId: vendor.id,
        email: vendor.email,
        type: "vendor"
      },
      jwtSecret,
      { expiresIn: "24h" }
    )

    console.log("Vendor login successful:", vendor.id)

    res.status(200).json({
      message: "Login successful",
      token,
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        farm_name: vendor.farm_name,
        location: vendor.location,
        category: vendor.category,
        is_active: vendor.is_active
      }
    })

  } catch (error) {
    console.error("Vendor login error:", error)
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors
      })
    }

    res.status(500).json({
      error: "Login failed",
      message: error.message
    })
  }
}
