"use client"

import { Product, Service } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrganizationProductsProps {
  products: Product[]
  services: Service[]
  isOwner: boolean
}

export function OrganizationProducts({ products, services, isOwner }: OrganizationProductsProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Products</h2>
          {isOwner && (
            <Button>Add Product</Button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {product.description && (
                  <p className="text-muted-foreground">{product.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Services</h2>
          {isOwner && (
            <Button>Add Service</Button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {service.description && (
                  <p className="text-muted-foreground">{service.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 