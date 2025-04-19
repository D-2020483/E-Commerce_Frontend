import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { clearCart } from "@/lib/features/cartSlice"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { ShoppingCart, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function PaymentPage() {
  const cart = useSelector((state) => state.cart.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check for valid order ID when component mounts
  useEffect(() => {
    const orderId = sessionStorage.getItem('currentOrderId');
    if (!orderId) {
      toast.error("No order found. Please complete checkout first.");
      navigate('/shop/checkout');
    }
  }, [navigate]);
  
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      const orderId = sessionStorage.getItem('currentOrderId');
      
      if (!orderId) {
        toast.error("No order found. Please complete checkout first.");
        navigate('/shop/checkout');
        return;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clear the cart
      dispatch(clearCart());

      // Show success toast
      toast.success("Payment Successful!", {
        description: `Order ID: ${orderId}, Total amount: $${totalPrice.toFixed(2)}`,
        icon: <CheckCircle className="w-5 h-5" />,
      });
      
      // Clear the order ID from session storage as it's no longer needed
      sessionStorage.removeItem('currentOrderId');
      
      // Navigate to complete page with orderId parameter
      navigate(`/shop/complete?orderId=${orderId}`);
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Failed to process payment. Please try again.");
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
                        ${(item.product.price * item.quantity).toFixed(2)}
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