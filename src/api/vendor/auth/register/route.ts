import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import bcrypt from "bcryptjs"
import VendorService from "../../../../services/vendor"

// Vendor registration schema
const vendorRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  farm_name: z.string().min(2, "Farm name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  description: z.string().optional(),
  category: z.string().min(2, "Category is required"),
  phone: z.string().optional(),
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
    
    console.log("Vendor registration request received")
    
    // Validate request body
    const validatedData = vendorRegisterSchema.parse(req.body)
    
    // Get vendor service (with fallback)
    let vendorService
    try {
      vendorService = req.scope.resolve("vendorService")
    } catch (error) {
      console.log("Failed to resolve vendorService, creating new instance:", error.message)
      vendorService = new VendorService(req.scope)
    }

    // Check if vendor with this email already exists
    const existingVendor = await vendorService.getByEmail(validatedData.email)
    if (existingVendor) {
      return res.status(400).json({
        error: "A vendor with this email already exists"
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create new vendor (auto-approve in development)
    const newVendor = await vendorService.create({
      ...validatedData,
      password: hashedPassword, // Store hashed password
      is_active: true, // Auto-approve for development testing
      commission_rate: 0.15, // Default commission rate
    })

    console.log("Vendor registration successful:", newVendor.id)

    res.status(201).json({
      message: "Vendor registration successful. Your account is pending approval.",
      vendor: {
        id: newVendor.id,
        name: newVendor.name,
        email: newVendor.email,
        farm_name: newVendor.farm_name,
        is_active: newVendor.is_active
      }
    })

  } catch (error) {
    console.error("Vendor registration error:", error)
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors
      })
    }

    res.status(500).json({
      error: "Registration failed",
      message: error.message
    })
  }
}
