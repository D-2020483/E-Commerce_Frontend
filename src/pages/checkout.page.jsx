import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import ShippingAddressForm from "../components/ShippingAddressform.jsx"
import { useCreateOrderMutation } from "@/lib/api"

export default function CheckoutPage() {
  const cart = useSelector((state) => state.cart.value)
  const navigate = useNavigate()
  const [createOrder] = useCreateOrderMutation()

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)
  }

  const handleOrderCreation = async (formData) => {
    try {
      const orderData = {
        items: cart.map(item => ({
          product: {
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price.toString(),
            image: item.product.image,
            description: item.product.description,
            variant: {
              name: 'default',
              stockAtPurchase: item.product.stock || 0
            }
          },
          quantity: item.quantity
        })),
        shippingAddress: formData
      }

      console.log("Creating order with data:", orderData);
      const response = await createOrder(orderData).unwrap();
      console.log("Order created successfully:", response);

      // Store the order ID in session storage
      sessionStorage.setItem('currentOrderId', response._id);

      // Navigate to payment page
      navigate('/shop/payment');
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to create order. Please try again.");
    }
  }

  if (cart.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button className="mt-4" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </main>
    );
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
            <ShippingAddressForm cart={cart} onSubmit={handleOrderCreation} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}