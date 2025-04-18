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

const formSchema = z.object({
  line_1: z.string().min(1, "Address line 1 is required"),
  line_2: z.string().min(1, "Address line 2 is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zip_code: z.string().min(1, "Zip Code is required"),
  phone: z.string().refine(
    (value) => {
      // This regex checks for a basic international phone number format
      return /^\+?[1-9]\d{1,14}$/.test(value);
    },
    {
      message: "Invalid phone number format",
    }
  ),
});

const ShippingAddressForm = ({ cart }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      line_1: "",
      line_2: "",
      city: "",
      state: "",
      zip_code: "",
      phone: "",
    },
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
      // Format the cart items according to the backend schema
      const formattedCart = cart.map(item => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price.toString(), // Convert to string as required by backend
          image: item.product.image || "",
          description: item.product.description || "No description available",
        },
        quantity: item.quantity,
      }));

      // Create the order with the formatted data
      const orderData = {
        items: formattedCart,
        shippingAddress: {
          line_1: values.line_1,
          line_2: values.line_2,
          city: values.city,
          state: values.state,
          zip_code: values.zip_code,
          phone: values.phone,
        },
      };

      console.log("Sending order data:", orderData);

      const response = await createOrder(orderData).unwrap();
      console.log("Order creation response:", response);

      if (!response || !response._id) {
        throw new Error("Invalid response from server - missing order ID");
      }

      // Store the order ID in session storage
      sessionStorage.setItem('currentOrderId', response._id);
      
      // Show success message
      toast.success("Order created successfully!");
      
      // Navigate to payment page
      navigate("/shop/payment");
    } catch (error) {
      console.error("Failed to create order:", error);
      
      // Show more specific error message
      if (error.status === 401) {
        toast.error("Please sign in to place an order");
      } else if (error.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="line_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
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
          <div>
            <Button type="submit" className="mt-4" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ShippingAddressForm;