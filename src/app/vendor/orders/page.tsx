"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Order } from "@/lib/types";
import { getAuthUser } from "@/lib/auth";

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

  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

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

    api.get("/orders/vendor/orders")
      .then((res) => setOrders(res.data.data))
      .finally(() => setLoading(false));

  };

  const updateStatus = async (
    orderId: number,
    status: string
  ) => {

    if (status === "SHIPPED") {

      const order = orders.find(o => o.id === orderId);

      if (!order) return;

      if (
        order.paymentStatus !== "PAID" ||
        order.status !== "CONFIRMED"
      ) {
        alert("Only paid and confirmed orders can be shipped.");
        return;
      }

      setSelectedOrderId(orderId);
      setCourierName("");
      setTrackingNumber("");
      setTrackingUrl("");
      setShowShipmentModal(true);
      return;
    }

    setUpdating(orderId);

    try {

      await api.put(`/orders/vendor/${orderId}/status`, {
        status,
      });

      fetchOrders();

    } finally {

      setUpdating(null);

    }

  };

  const shipOrder = async () => {

    if (!selectedOrderId) return;

    if (!courierName.trim()) {
      alert("Courier name is required");
      return;
    }

    if (!trackingNumber.trim()) {
      alert("Tracking number is required");
      return;
    }

    setUpdating(selectedOrderId);

    try {

      await api.put(
        `/orders/vendor/${selectedOrderId}/ship`,
        {
          courierName,
          trackingNumber,
          trackingUrl,
        }
      );

      setShowShipmentModal(false);

      fetchOrders();

    } finally {

      setUpdating(null);

    }

  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Orders
        </h1>

        {loading ? (
          <p className="text-gray-500">
            Loading...
          </p>
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
                      {order.buyerName} · {order.createdAt?.slice(0,10)}
                    </p>

                  </div>

                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>

                </div>
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>
                        {item.productName} × {item.quantity}
                      </span>

                      <span>
                        ₹{item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {(order.status === "SHIPPED" ||
                  order.status === "DELIVERED") &&
                  order.courierName && (
                    <div className="border-t pt-3 mt-3 space-y-2 text-sm text-gray-700">

                      <p>
                        <strong>Courier:</strong>{" "}
                        {order.courierName}
                      </p>

                      <p>
                        <strong>Tracking Number:</strong>{" "}
                        {order.trackingNumber}
                      </p>

                      {order.trackingUrl && (
                        <p>
                          <strong>Tracking:</strong>{" "}
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Track Package
                          </a>
                        </p>
                      )}

                      {order.shippedAt && (
                        <p>
                          <strong>Shipped At:</strong>{" "}
                          {new Date(
                            order.shippedAt
                          ).toLocaleString()}
                        </p>
                      )}

                    </div>
                  )}

                <div className="flex items-center gap-3 border-t pt-3">

                  <span className="text-sm text-gray-500">
                    Update Status
                  </span>

                  <select
                    value={order.status}
                    disabled={updating === order.id}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    className="border rounded-lg px-3 py-2"
                  >

                    {order.status === "PENDING" && (
                      <option value="PENDING">
                        PENDING
                      </option>
                    )}

                    {order.status === "CONFIRMED" && (
                      <>
                        <option value="CONFIRMED">
                          CONFIRMED
                        </option>

                        <option value="SHIPPED">
                          SHIPPED
                        </option>

                        <option value="CANCELLED">
                          CANCELLED
                        </option>
                      </>
                    )}

                    {order.status === "SHIPPED" && (
                      <>
                        <option value="SHIPPED">
                          SHIPPED
                        </option>

                        <option value="DELIVERED">
                          DELIVERED
                        </option>
                      </>
                    )}

                    {order.status === "DELIVERED" && (
                      <option value="DELIVERED">
                        DELIVERED
                      </option>
                    )}

                    {order.status === "CANCELLED" && (
                      <option value="CANCELLED">
                        CANCELLED
                      </option>
                    )}

                  </select>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
      {/* Shipment Modal */}
      {showShipmentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">
              Ship Order
            </h2>

            <input
              type="text"
              placeholder="Courier Name"
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3"
            />

            <input
              type="text"
              placeholder="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3"
            />

            <input
              type="text"
              placeholder="Tracking URL"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowShipmentModal(false);
                  setSelectedOrderId(null);
                  setCourierName("");
                  setTrackingNumber("");
                  setTrackingUrl("");
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={shipOrder}
                disabled={updating === selectedOrderId}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                {updating === selectedOrderId
                  ? "Shipping..."
                  : "Ship Order"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}