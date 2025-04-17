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

const formSchema = z.object({
  line_1: z.string().min(1, "Address line 1 is required"),
  line_2: z.string().min(1, "Address line 2 is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zip_code: z.string().min(1, "Zip Code is required"),
  phone: z.string().refine(
    (value) => {
      return /^\+?[1-9]\d{1,14}$/.test(value);
    },
    {
      message: "Invalid phone number format",
    }
  ),
});

const ShippingAddressForm = ({ cart }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  const [createOrder] = useCreateOrderMutation();
  const navigate = useNavigate();

  async function handleSubmit(values) {
    console.log("Form values:", values); 
    const formattedCart = cart.map((item) => ({
      product: {
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        description: item.product.description || "No description available",
      },
      quantity: item.quantity,
    }));

    console.log("Formatted cart:", formattedCart); 

    try {
      const response = await createOrder({
        items: formattedCart,
        shippingAddress: {
          line_1: values.line_1,
          line_2: values.line_2,
          city: values.city,
          state: values.state,
          zip_code: values.zip_code,
          phone: values.phone,
        },
      });

      console.log("Order response:", response); 

      if (response?.data?._id) {
        navigate(`/shop/complete?orderId=${response.data._id}`);
      } else {
        console.error("Order creation failed:", response.error || response);
        alert("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Error during order creation:", error);
      alert("An error occurred. Please try again.");
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
                  <FormLabel>Line 2</FormLabel>
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
            <Button type="submit">Proceed to Payment</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ShippingAddressForm;