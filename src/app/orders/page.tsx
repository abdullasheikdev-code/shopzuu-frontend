"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Order } from "@/lib/types";
import { isAuthenticated } from "@/lib/auth";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    api
      .get("/orders/my-orders")
      .then((res) => setOrders(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">
          You haven&apos;t placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <p className="font-semibold text-gray-900">
                  {order.orderNumber}
                </p>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    statusColors[order.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="space-y-1 mb-3">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>₹{item.subtotal.toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-900 pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}