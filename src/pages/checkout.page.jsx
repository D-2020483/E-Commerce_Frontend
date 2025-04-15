import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import ShippingAddressForm from "../components/ShippingAddressform.jsx";

export default function CheckoutPage() {
  const cart = useSelector((state) => state.cart.value);
  const [loading, setLoading] = useState(false); // for loading state
  const [error, setError] = useState(null); // for error handling
  const [success, setSuccess] = useState(null); // for success message

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Send order data to backend
    const orderDetails = cart.map(item => ({
      productId: item.product._id, // assuming the product has an _id
      quantity: item.quantity,
    }));

    try {
      const response = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderDetails }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Order placed successfully!');
      } else {
        setError(data.message || 'Failed to place order');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      {/* Checkout Button and Loading/Error Messages */}
      <div className="mt-8">
        {success && <p className="text-green-500 font-bold">{success}</p>}
        {error && <p className="text-red-500 font-bold">{error}</p>}
        <Button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full mt-4"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </main>
  );
}
