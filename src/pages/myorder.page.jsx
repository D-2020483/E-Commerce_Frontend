import React, { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function MyOrdersPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await window.Clerk?.session?.getToken();
        console.log("Token:", token); 
        const res = await fetch("/api/orders/user/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (isSignedIn) {
      fetchOrders();
    }
  }, [isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
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
    )
  }

  if (!isSignedIn) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-4">Please sign in to view your orders</h2>
      </div>
    )
  }

  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-4">
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
              <Badge variant="outline">{order.status}</Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-2">
              <p>Total Amount: ${order.totalAmount}</p>
              <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
};
