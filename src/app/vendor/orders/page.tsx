"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Order } from "@/lib/types";
import { getAuthUser } from "@/lib/auth";
import {
  AlertCircle,
  Box,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MapPin,
  Package,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  ShoppingBag,
  Truck,
  UserRound,
  X,
} from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  CONFIRMED: "border-blue-200 bg-blue-50 text-blue-700",
  SHIPPED: "border-violet-200 bg-violet-50 text-violet-700",
  DELIVERED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CANCELLED: "border-red-200 bg-red-50 text-red-700",
  REFUNDED: "border-gray-200 bg-gray-100 text-gray-700",
};

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Package className="h-3.5 w-3.5" />,
  CONFIRMED: <CheckCircle2 className="h-3.5 w-3.5" />,
  SHIPPED: <Truck className="h-3.5 w-3.5" />,
  DELIVERED: <PackageCheck className="h-3.5 w-3.5" />,
  CANCELLED: <X className="h-3.5 w-3.5" />,
  REFUNDED: <RefreshCw className="h-3.5 w-3.5" />,
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

  const [shipmentError, setShipmentError] = useState("");

  useEffect(() => {
    const user = getAuthUser();

    if (!user || user.role !== "VENDOR") {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const res = await api.get("/orders/vendor/orders");

      setOrders(
        Array.isArray(res.data?.data)
          ? res.data.data
          : []
      );
    } catch (err) {
      console.error("VENDOR ORDERS ERROR:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const closeShipmentModal = () => {
    setShowShipmentModal(false);
    setSelectedOrderId(null);
    setCourierName("");
    setTrackingNumber("");
    setTrackingUrl("");
    setShipmentError("");
  };

  const updateStatus = async (
    orderId: number,
    status: string
  ) => {
    if (status === "SHIPPED") {
      const order = orders.find(
        (item) => item.id === orderId
      );

      if (!order) return;

      if (
        order.paymentStatus !== "PAID" ||
        order.status !== "CONFIRMED"
      ) {
        alert(
          "Only paid and confirmed orders can be shipped."
        );
        return;
      }

      setSelectedOrderId(orderId);
      setCourierName("");
      setTrackingNumber("");
      setTrackingUrl("");
      setShipmentError("");
      setShowShipmentModal(true);

      return;
    }

    setUpdating(orderId);

    try {
      await api.put(
        `/orders/vendor/${orderId}/status`,
        {
          status,
        }
      );

      await fetchOrders();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdating(null);
    }
  };

  const shipOrder = async () => {
    if (!selectedOrderId) return;

    setShipmentError("");

    if (!courierName.trim()) {
      setShipmentError("Courier name is required.");
      return;
    }

    if (!trackingNumber.trim()) {
      setShipmentError("Tracking number is required.");
      return;
    }

    setUpdating(selectedOrderId);

    try {
      await api.put(
        `/orders/vendor/${selectedOrderId}/ship`,
        {
          courierName: courierName.trim(),
          trackingNumber: trackingNumber.trim(),
          trackingUrl: trackingUrl.trim(),
        }
      );

      closeShipmentModal();
      await fetchOrders();
    } catch (err: any) {
      setShipmentError(
        err.response?.data?.message ||
          "Failed to ship order."
      );
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#f7f8fc]">
        {/* HEADER */}
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-indigo-600">
                  <ReceiptText className="h-3.5 w-3.5" />
                  Order Management
                </div>

                <h1 className="text-3xl font-black tracking-tight text-gray-950">
                  Customer Orders
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Process orders, update delivery status, and
                  manage shipments.
                </p>
              </div>

              {!loading && (
                <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <ShoppingBag className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Total orders
                    </p>

                    <p className="text-lg font-black text-gray-950">
                      {orders.length}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* LOADING */}
          {loading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-[28px] border border-gray-200 bg-white p-6"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="h-5 w-36 animate-pulse rounded bg-gray-100" />
                      <div className="mt-3 h-4 w-52 animate-pulse rounded bg-gray-100" />
                    </div>

                    <div className="h-8 w-24 animate-pulse rounded-full bg-gray-100" />
                  </div>

                  <div className="mt-7 h-20 animate-pulse rounded-2xl bg-gray-50" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            /* EMPTY */
            <div className="rounded-[32px] border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <ShoppingBag className="h-7 w-7" />
              </div>

              <h2 className="mt-5 text-xl font-black text-gray-950">
                No orders yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                New customer orders will appear here when
                buyers purchase your products.
              </p>
            </div>
          ) : (
            /* ORDERS */
            <div className="space-y-5">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* ORDER HEADER */}
                  <div className="flex flex-col gap-5 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-white">
                        <Box className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-gray-950">
                          {order.orderNumber}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <UserRound className="h-3.5 w-3.5" />
                            {order.buyerName}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${
                        statusColors[order.status] ||
                        "border-gray-200 bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusIcons[order.status]}
                      {order.status}
                    </span>
                  </div>

                  {/* ORDER BODY */}
                  <div className="p-5 sm:p-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
                      {/* ITEMS */}
                      <div>
                        <p className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">
                          Order Items
                        </p>

                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/70">
                          {order.items.map((item, index) => (
                            <div
                              key={`${item.productId}-${index}`}
                              className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3.5 last:border-0"
                            >
                              <div>
                                <p className="text-sm font-bold text-gray-900">
                                  {item.productName}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  Quantity: {item.quantity}
                                </p>
                              </div>

                              <p className="shrink-0 text-sm font-black text-gray-950">
                                ₹{item.subtotal.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ACTION */}
                      <div>
                        <p className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">
                          Order Status
                        </p>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <label className="mb-2 block text-xs font-bold text-gray-500">
                            Update status
                          </label>

                          <div className="relative">
                            <select
                              value={order.status}
                              disabled={updating === order.id}
                              onChange={(e) =>
                                updateStatus(
                                  order.id,
                                  e.target.value
                                )
                              }
                              className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-10 text-sm font-bold text-gray-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
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

                              {order.status === "REFUNDED" && (
                                <option value="REFUNDED">
                                  REFUNDED
                                </option>
                              )}
                            </select>

                            {updating === order.id && (
                              <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-indigo-600" />
                            )}
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                            <span className="text-sm font-bold text-gray-500">
                              Total
                            </span>

                            <span className="text-lg font-black text-gray-950">
                              ₹{order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SHIPMENT DETAILS */}
                    {(order.status === "SHIPPED" ||
                      order.status === "DELIVERED") &&
                      order.courierName && (
                        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                              <Truck className="h-5 w-5" />
                            </div>

                            <div>
                              <h3 className="font-black text-gray-950">
                                Shipment Details
                              </h3>

                              <p className="text-xs text-gray-500">
                                Package tracking information
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-4 text-sm sm:grid-cols-3">
                            <div>
                              <p className="text-xs font-medium text-gray-500">
                                Courier
                              </p>

                              <p className="mt-1 font-bold text-gray-900">
                                {order.courierName}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-medium text-gray-500">
                                Tracking number
                              </p>

                              <p className="mt-1 break-all font-bold text-gray-900">
                                {order.trackingNumber}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-medium text-gray-500">
                                Shipped at
                              </p>

                              <p className="mt-1 font-bold text-gray-900">
                                {order.shippedAt
                                  ? new Date(
                                      order.shippedAt
                                    ).toLocaleString()
                                  : "-"}
                              </p>
                            </div>
                          </div>

                          {order.trackingUrl && (
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-600 shadow-sm ring-1 ring-indigo-100 transition hover:bg-indigo-600 hover:text-white"
                            >
                              Track Package
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* SHIPMENT MODAL */}
      {showShipmentModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeShipmentModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Truck className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-950">
                    Ship Order
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Add package tracking details.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeShipmentModal}
                disabled={updating === selectedOrderId}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6">
              {shipmentError && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {shipmentError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Courier Name
                  </label>

                  <div className="relative">
                    <Truck className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />

                    <input
                      type="text"
                      placeholder="e.g. Delhivery"
                      value={courierName}
                      onChange={(e) =>
                        setCourierName(e.target.value)
                      }
                      className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Tracking Number
                  </label>

                  <div className="relative">
                    <Package className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />

                    <input
                      type="text"
                      placeholder="Enter tracking number"
                      value={trackingNumber}
                      onChange={(e) =>
                        setTrackingNumber(e.target.value)
                      }
                      className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Tracking URL
                    <span className="ml-1 font-normal text-gray-400">
                      (optional)
                    </span>
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />

                    <input
                      type="url"
                      placeholder="https://..."
                      value={trackingUrl}
                      onChange={(e) =>
                        setTrackingUrl(e.target.value)
                      }
                      className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={closeShipmentModal}
                  disabled={updating === selectedOrderId}
                  className="h-12 flex-1 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={shipOrder}
                  disabled={updating === selectedOrderId}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updating === selectedOrderId ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Shipping...
                    </>
                  ) : (
                    <>
                      <Truck className="h-4 w-4" />
                      Ship Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}