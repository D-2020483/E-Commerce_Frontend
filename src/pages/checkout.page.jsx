import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSelector } from "react-redux"
import ShippingAddressForm from "../components/ShippingAddressform"

export default function CheckoutPage() {
  const cart = useSelector((state) => state.cart.value)

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <ShippingAddressForm cart={cart} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}