import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSelector } from "react-redux"
import ShippingAddressForm from "../components/ShippingAddressform.jsx"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe("pk_test_51REMTKGbLE6tJsSX4Kkhk7Cdfh4xGP69ky77Lgnqrqnk7PR12LM07gMvtsSdBa9ZDfihFyK0kaUxVR29ENw0HD2w00H5EreQR6") 

export default function CheckoutPage() {
  const cart = useSelector((state) => state.cart.value)

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ).toFixed(2)
  }

  const handleCheckout = async () => {
    const stripe = await stripePromise
    try {
      const response = await fetch("https://fed-storefront-backend-dinithi.onrender.com/api/payment/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Checkout error:", error)
    }
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
            <Button onClick={handleCheckout} className="mt-4">
              Pay with Stripe
            </Button>
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
