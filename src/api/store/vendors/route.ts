import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // Simple response without database for now
  res.json({
    vendors: [
      {
        id: "vendor_demo1",
        name: "Demo Farmer 1", 
        farm_name: "Green Valley Farm",
        email: "demo1@example.com",
        is_active: true
      },
      {
        id: "vendor_demo2", 
        name: "Demo Farmer 2",
        farm_name: "Sunny Hills Farm", 
        email: "demo2@example.com",
        is_active: true
      }
    ]
  })
}
