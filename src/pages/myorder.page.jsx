import React, { useEffect } from "react"
import { useUser, useAuth } from "@clerk/clerk-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useGetOrdersByUserIdQuery } from "@/lib/api"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

export default function MyOrdersPage() {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading, error, refetch } = useGetOrdersByUserIdQuery(undefined, {
    // Skip the query if not signed in
    skip: !isSignedIn
  });

  // Refetch orders when auth state changes
  useEffect(() => {
    if (isSignedIn) {
      refetch();
    }
  }, [isSignedIn, refetch]);

  if (!isLoaded || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Please sign in to view your orders</h2>
            <Button onClick={() => navigate("/sign-in")}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-red-500">
              Error loading orders
            </h2>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-6 h-6" />
        <h2 className="text-2xl font-semibold">My Orders</h2>
      </div>

      <div className="space-y-4">
        {!orders || orders.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No orders found.</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="border-b bg-muted/50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono">{order._id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={order.paymentStatus === "PAID" ? "success" : "secondary"}>
                      {order.paymentStatus}
                    </Badge>
                    <Badge variant="outline">{order.orderStatus}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-2">Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div 
                          key={index}
                          className="flex justify-between items-center text-sm border-b last:border-0 pb-2 last:pb-0"
                        >
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">
                            ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-right">
                      <p className="text-muted-foreground">Total</p>
                      <p className="text-lg font-bold">
                        ${order.items.reduce((acc, item) => 
                          acc + (parseFloat(item.product.price) * item.quantity), 0
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <div className="space-y-1 text-sm">
                      <p>{order.addressId.line_1}</p>
                      {order.addressId.line_2 && <p>{order.addressId.line_2}</p>}
                      <p>
                        {order.addressId.city}, {order.addressId.state} {order.addressId.zip_code}
                      </p>
                      <p className="font-medium mt-2">Phone: {order.addressId.phone}</p>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
