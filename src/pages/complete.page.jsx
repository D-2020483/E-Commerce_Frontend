import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router";
import { useGetOrderQuery } from "@/lib/api";
import { CheckCircle2Icon } from "lucide-react";

function CompletePage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { data, isLoading, error } = useGetOrderQuery(orderId);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">Loading...</div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-500">
          {error ? "Failed to load order details." : "Order not found."}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center space-x-4 border-b pb-4">
            <CheckCircle2Icon className="h-10 w-10 text-green-500" />
            <CardTitle className="text-3xl font-bold text-primary">
              complete purchase
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
            {/* Order Items */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {data.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-muted/50 p-4 rounded-lg flex justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right space-y-2">
                <p className="text-xl font-bold">
                  Total: $
                  {data.items.reduce(
                    (acc, item) => acc + item.product.price * item.quantity,
                    0
                  ).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Payment Method: Cash on Delivery
                </p>
              </div>
            </div>

            {/* Order Details */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Order Information</h3>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-medium">{data._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600">
                    {data.paymentStatus}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-4">
                Shipping Address
              </h3>
              <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                <p>{data.addressId.line_1}</p>
                {data.addressId.line_2 && <p>{data.addressId.line_2}</p>}
                <p>
                  {data.addressId.city}, {data.addressId.state}{" "}
                  {data.addressId.zip_code}
                </p>
                <p>{data.addressId.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

export default CompletePage;