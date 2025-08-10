import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({
    message: "Hello from Co-Shop test route!",
    timestamp: new Date().toISOString()
  })
}
