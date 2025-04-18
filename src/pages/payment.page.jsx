import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { clearCart } from "@/lib/features/cartSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function PaymentPage() {
  const cart = useSelector((state) => state.cart.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    try {
      // Prepare the order data to send to the backend
      const orderData = {
        items: cart.map((item) => ({
          product: {
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            description: item.product.description,
          },
          quantity: item.quantity,
        })),
        totalAmount: totalPrice,
        userId: "user_2ssdkR3frHTMU1SRkCIQqVns8eI",
        addressId: "_id",
      };

      // Make an API call to the backend to create the order
      const response = await fetch("https://fed-storefront-backend-dinithi.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place the order");
      }

      const { orderId } = await response.json();

      // Clear the cart
      dispatch(clearCart());

      // Show success toast
      toast.success("Order Placed Successfully", {
        description: `Order ID: ${orderId}, Total amount: $${totalPrice.toFixed(2)}`,
        icon: <CheckCircle className="w-5 h-5" />,
      });

      // Redirect to the Complete page with the orderId as a query parameter
      navigate(`/shop/complete?orderId=${orderId}`);
    } catch (error) {
      // Handle errors
      toast.error("Failed to place the order. Please try again.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Order Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <div className="text-sm text-muted-foreground">
                      <span>Quantity: {item.quantity}</span>
                      <span className="ml-2">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-xl font-bold">
            Total: ${totalPrice.toFixed(2)}
          </div>
          <Button onClick={handlePlaceOrder} disabled={cart.length === 0}>
            Place Order
          </Button>  
        </CardFooter>
      </Card>
    </main>
  );
}