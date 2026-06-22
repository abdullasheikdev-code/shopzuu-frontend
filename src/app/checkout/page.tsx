"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Cart } from "@/lib/types";
import { getAuthUser, isAuthenticated } from "@/lib/auth";
import { useCartStore } from "@/lib/cartStore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const setItemCount = useCartStore((s) => s.setItemCount);

  const [cart, setCart] = useState<Cart | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    api
      .get("/cart")
      .then((res) => {
        if (res.data.data.items.length === 0) {
          router.push("/cart");
        }
        setCart(res.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setError("Please enter a shipping address");
      return;
    }

    setError("");
    setPlacing(true);

    try {
      // 1. Place the order (creates Order with PENDING payment status)
      const orderRes = await api.post("/orders/place", {
        shippingAddress: address,
        paymentGateway: "RAZORPAY",
      });
      const order = orderRes.data.data;

      // 2. Create Razorpay order on backend
      const rzpRes = await api.post(
        `/payments/razorpay/create-order?orderId=${order.id}`
      );
      const rzpData = rzpRes.data.data;

      const user = getAuthUser();

      // 3. Open Razorpay checkout
      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: "Shopzuu",
        description: `Order ${order.orderNumber}`,
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        handler: async function (response: any) {
          try {
            await api.post("/payments/razorpay/verify", null, {
              params: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: order.id,
              },
            });
            setItemCount(0);
            router.push(`/orders/${order.id}/success`);
          } catch (err) {
            setError("Payment verification failed. Contact support.");
          }
        },
        theme: { color: "#4f46e5" },
        modal: {
          ondismiss: function () {
            setPlacing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to place order");
      setPlacing(false);
    }
  };

  if (loading || !cart) {
    return <div className="max-w-3xl mx-auto px-4 py-12">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Shipping Address
            </h3>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              placeholder="House no, street, city, state, pincode"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Items ({cart.totalItems})
            </h3>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900">
                    ₹{item.subtotal.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit">
          <h3 className="font-semibold text-gray-900 mb-4">
            Payment Summary
          </h3>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>₹{cart.totalAmount.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-gray-900 mb-6">
            <span>Total</span>
            <span>₹{cart.totalAmount.toFixed(0)}</span>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
          >
            {placing ? "Processing..." : "Pay Now"}
          </button>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Secured by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}