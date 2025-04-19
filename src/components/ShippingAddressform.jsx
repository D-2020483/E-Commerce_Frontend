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
import { useState, useEffect } from "react";
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

  // Debug log to see cart structure
  useEffect(() => {
    console.log("Current cart state:", cart);
  }, [cart]);

  async function handleSubmit(values) {
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      if (!isSignedIn) {
        toast.error("Please sign in to place an order");
        return;
      }

      // Validate and format cart items
      const validCartItems = cart.filter(item => 
        item && 
        item.product && 
        typeof item.product === 'object' &&
        item.product._id &&
        item.quantity
      );

      if (validCartItems.length === 0) {
        toast.error("No valid items in cart");
        return;
      }

      const formattedCart = validCartItems.map(item => {
        const product = item.product;
        return {
          product: {
            _id: product._id.toString(),
            name: product.name.toString(),
            price: product.price.toString(),
            image: product.image.toString(),
            description: (product.description || "No description available").toString(),
          },
          quantity: parseInt(item.quantity, 10)
        };
      });

      const payload = {
        items: formattedCart,
        shippingAddress: {
          line_1: values.line_1.trim(),
          line_2: (values.line_2 || "Not provided").trim(),
          city: values.city.trim(),
          state: values.state.trim(),
          zip_code: values.zip_code.trim(),
          phone: values.phone.trim(),
        },
      };

      // Log the final payload
      console.log("Sending order payload:", JSON.stringify(payload, null, 2));

      const response = await createOrder(payload).unwrap();
      console.log("Order creation response:", response);

      if (response && response._id) {
        sessionStorage.setItem("currentOrderId", response._id);
        navigate("/shop/payment");
      } else {
        console.error("Invalid response:", response);
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      const errorMessage = error.data?.message || error.message || "Failed to create order. Please try again.";
      toast.error(errorMessage);
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