import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { useCreateOrderMutation } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

const formSchema = z.object({
  line_1: z.string().min(1, "Address line 1 is required"),
  line_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zip_code: z.string().min(1, "Zip Code is required"),
  phone: z.string().refine(
    (value) => /^\+?[1-9]\d{1,14}$/.test(value),
    { message: "Invalid phone number format" }
  ),
});

const ShippingAddressForm = ({ cart }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSignedIn, getToken } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  const [createOrder] = useCreateOrderMutation();
  const navigate = useNavigate();

  async function handleSubmit(values) {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      if (!isSignedIn) {
        toast.error("Please sign in to place an order");
        return;
      }

      const token = await getToken();
      console.log("Authentication token present:", !!token);

      // Validate cart items
      if (!Array.isArray(cart) || cart.some(item => !item.product?._id || !item.quantity)) {
        console.error("Invalid cart structure:", cart);
        toast.error("Invalid cart data");
        return;
      }

      // Log the raw cart data for debugging
      console.log("Raw cart item example:", cart[0]);

      const formattedCart = cart.map((item) => ({
        product: {
          _id: String(item.product._id),
          name: String(item.product.name),
          price: String(item.product.price), 
          image: String(item.product.image),
          description: String(item.product.description || "No description available"),
        },
        quantity: Number(item.quantity), 
      }));
  
      const payload = {
        items: formattedCart,
        shippingAddress: {
          line_1: String(values.line_1).trim(),
          line_2: String(values.line_2 || "Not provided").trim(),
          city: String(values.city).trim(),
          state: String(values.state).trim(),
          zip_code: String(values.zip_code).trim(),
          phone: String(values.phone).trim(),
        },
      };
  
      // Detailed validation logging
      console.log("Raw cart data:", JSON.stringify(cart, null, 2));
      console.log("Formatted cart:", JSON.stringify(formattedCart, null, 2));
      console.log("Full payload:", JSON.stringify(payload, null, 2));
      
      // Validate payload structure matches backend schema
      const validationCheck = {
        hasValidItems: payload.items.every(item => 
          item.product._id && 
          item.product.name && 
          item.product.price && 
          item.product.image && 
          item.product.description &&
          typeof item.quantity === 'number'
        ),
        hasValidAddress: Boolean(
          payload.shippingAddress.line_1 &&
          payload.shippingAddress.line_2 &&
          payload.shippingAddress.city &&
          payload.shippingAddress.state &&
          payload.shippingAddress.zip_code &&
          payload.shippingAddress.phone
        )
      };
      
      console.log("Validation check:", validationCheck);

      if (!validationCheck.hasValidItems || !validationCheck.hasValidAddress) {
        throw new Error("Invalid payload structure");
      }
  
      const response = await createOrder(payload).unwrap();
  
      console.log("API Response:", response);
  
      if (response._id) {
        sessionStorage.setItem("currentOrderId", response._id);
        navigate("/shop/payment");
      } else {
        throw new Error("Order ID not found in response");
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      const errorMessage = error.data?.message || error.message || "Failed to create order. Please try again.";
      toast.error(errorMessage);
      console.error("Error details:", {
        status: error.status,
        data: error.data,
        message: error.message,
        stack: error.stack
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            <FormField
              control={form.control}
              name="line_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="16/1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="line_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Kadawatha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input placeholder="Western Province" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="11850" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+94702700100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Proceed to Payment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ShippingAddressForm;