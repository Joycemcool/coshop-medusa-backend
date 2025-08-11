import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Table, Badge, Text } from "@medusajs/ui"
import { useState, useEffect } from "react"

type Vendor = {
  id: string
  name: string
  email: string
  farm_name?: string
  location?: string
  category?: string
  is_active: boolean
  commission_rate?: number
  created_at: string
}

const VendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true)
        const response = await fetch('/admin/vendors', {
          credentials: 'include',
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setVendors(data.vendors || [])
      } catch (err) {
        console.error('Error fetching vendors:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch vendors')
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  if (loading) {
    return (
      <Container className="p-6">
        <Text>Loading vendors...</Text>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="p-6">
        <Text className="text-red-500">Error: {error}</Text>
      </Container>
    )
  }

  return (
    <Container className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Vendors</Heading>
        <Text className="text-gray-500">{vendors.length} vendors</Text>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Farm Name</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Commission</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {vendors.map((vendor) => (
              <Table.Row key={vendor.id}>
                <Table.Cell>
                  <Text className="font-medium">{vendor.name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{vendor.farm_name || '-'}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text className="text-sm text-gray-600">{vendor.location || '-'}</Text>
                </Table.Cell>
                <Table.Cell>
                  {vendor.category && (
                    <Badge variant="secondary" size="small">
                      {vendor.category}
                    </Badge>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Text>{vendor.commission_rate ? `${(vendor.commission_rate * 100).toFixed(1)}%` : '-'}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={vendor.is_active ? "green" : "red"} size="small">
                    {vendor.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text className="text-sm">{vendor.email}</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      
      {vendors.length === 0 && (
        <div className="text-center py-12">
          <Text className="text-gray-500">No vendors found</Text>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Vendors",
  icon: "users",
})

export default VendorsPage
