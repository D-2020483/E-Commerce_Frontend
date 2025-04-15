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
        const res = await fetch("/api/orders/me", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isSignedIn) {
      fetchOrders()
    }
  }, [isSignedIn])

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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">You haven’t placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-4">
            <CardHeader className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Order ID: {order.id}</h2>
                <Badge variant="outline" className="capitalize">{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm">Date: {new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-sm">Total: LKR {order.total.toFixed(2)}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
