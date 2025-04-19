import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { clearCart } from "@/lib/features/cartSlice"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "sonner"
import { ShoppingCart, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useUpdateOrderMutation } from "@/lib/api"

export default function PaymentPage() {
  const cart = useSelector((state) => state.cart.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [updateOrder] = useUpdateOrderMutation();
  
  useEffect(() => {
    const orderId = sessionStorage.getItem('currentOrderId');
    if (!orderId) {
      toast.error("No order found. Please complete checkout first.");
      navigate('/shop/checkout');
      return;
    }
    console.log("Found order ID in payment page:", orderId);
  }, [navigate]);
  
  const totalPrice = cart.reduce(
    (acc, item) => acc + (parseFloat(item.product.price) * item.quantity),
    0
  );

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      const orderId = sessionStorage.getItem('currentOrderId');
      if (!orderId) {
        throw new Error("No order found. Please complete checkout first.");
      }

      console.log("Processing payment for order:", orderId);

      // Update order status to PAID
      const result = await updateOrder({ 
        orderId,
        type: "succeeded"
      }).unwrap();

      console.log("Payment processed successfully:", result);

      // Clear the cart
      dispatch(clearCart());

      // Show success toast
      toast.success("Payment Successful!", {
        description: `Order ID: ${orderId}, Total amount: $${totalPrice.toFixed(2)}`,
        icon: <CheckCircle className="w-5 h-5" />,
      });

      // Navigate to complete page with orderId parameter
      navigate(`/shop/complete?orderId=${orderId}`);
      
      // Clear the order ID from session storage after successful navigation
      sessionStorage.removeItem('currentOrderId');
    } catch (error) {
      console.error("Payment processing error:", error);
      let errorMessage = "Failed to process payment. ";
      if (error.data?.message) {
        errorMessage += error.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      }
      toast.error(errorMessage);
      
      if (error.status === 404) {
        navigate('/shop/checkout');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Payment Details
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
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Payment Summary</h3>
            <div className="flex justify-between items-center">
              <span>Total Amount:</span>
              <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handlePlaceOrder} 
            disabled={isProcessing || cart.length === 0}
            className="w-full md:w-auto"
          >
            {isProcessing ? "Processing Payment..." : "Complete Payment"}
          </Button>  
        </CardFooter>
      </Card>
    </main>
  )
}