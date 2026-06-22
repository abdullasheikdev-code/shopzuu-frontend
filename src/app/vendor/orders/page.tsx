"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Order } from "@/lib/types";
import { getAuthUser } from "@/lib/auth";

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export default function VendorOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.role !== "VENDOR") {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    api
      .get("/orders/vendor/orders")
      .then((res) => setOrders(res.data.data))
      .finally(() => setLoading(false));
  };

  const updateStatus = async (orderId: number, status: string) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/vendor/${orderId}/status`, { status });
      fetchOrders();
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.buyerName} · {order.createdAt?.slice(0, 10)}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>
                      ₹{item.subtotal.toFixed(0)} (you earn ₹
                      {item.vendorEarning.toFixed(0)})
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">Update status:</span>
                <select
                  disabled={updating === order.id}
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}