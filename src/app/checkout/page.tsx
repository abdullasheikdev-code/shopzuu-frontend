"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Cart } from "@/lib/types";
import { getAuthUser, isAuthenticated } from "@/lib/auth";
import { useCartStore } from "@/lib/cartStore";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Gift,
  Loader2,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Truck,
} from "lucide-react";

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

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

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
          return;
        }

        setCart(res.data.data);
      })
      .catch(() => {
        setError("Unable to load your cart. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const applyCoupon = async () => {
    if (!couponCode.trim() || !cart) return;

    setCouponError("");
    setApplyingCoupon(true);

    try {
      const res = await api.post(
        `/coupons/validate?code=${encodeURIComponent(
          couponCode
        )}&orderAmount=${cart.totalAmount}`
      );

      setDiscount(res.data.data.discountAmount);
      setCouponApplied(true);
    } catch (err: any) {
      setCouponApplied(false);
      setDiscount(0);

      setCouponError(
        err.response?.data?.message || "Invalid coupon"
      );
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setError("Please enter a shipping address");
      return;
    }

    if (!window.Razorpay) {
      setError(
        "Payment service is still loading. Please try again in a moment."
      );
      return;
    }

    setError("");
    setPlacing(true);

    try {
      const orderRes = await api.post("/orders/place", {
        shippingAddress: address,
        paymentGateway: "RAZORPAY",
        couponCode: couponApplied ? couponCode : null,
      });

      const order = orderRes.data.data;

      const rzpRes = await api.post(
        `/payments/razorpay/create-order?orderId=${order.id}`
      );

      const rzpData = rzpRes.data.data;
      const user = getAuthUser();

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
            await api.post(
              "/payments/razorpay/verify",
              null,
              {
                params: {
                  razorpayOrderId:
                    response.razorpay_order_id,
                  razorpayPaymentId:
                    response.razorpay_payment_id,
                  razorpaySignature:
                    response.razorpay_signature,
                  orderId: order.id,
                },
              }
            );

            setItemCount(0);

            router.push(
              `/orders/${order.id}/success`
            );
          } catch (err) {
            setError(
              "Payment verification failed. Contact support."
            );

            setPlacing(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPlacing(false);
          },
        },

        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to place order"
      );

      setPlacing(false);
    }
  };

  if (loading || !cart) {
    return <CheckoutSkeleton />;
  }

  const finalTotal = Math.max(
    0,
    cart.totalAmount -
      (couponApplied ? discount : 0)
  );

  return (
    <main className="min-h-screen bg-[#f7f7fb]">
      {/* TOP HEADER */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />

        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-violet-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/cart")}
            className="group mb-7 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to cart
          </button>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />

                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
                  Almost there
                </p>
              </div>

              <h1 className="text-4xl font-black tracking-[-0.04em] text-gray-950 sm:text-5xl">
                Secure checkout
              </h1>

              <p className="mt-3 max-w-xl text-gray-500">
                Review your order, add your delivery
                address, and complete your payment securely.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-extrabold text-gray-900">
                  Secure payment
                </p>

                <p className="text-xs text-gray-500">
                  Your payment details are protected
                </p>
              </div>
            </div>
          </div>

          {/* STEPS */}
          <div className="mt-9 flex max-w-2xl items-center">
            <CheckoutStep
              number="1"
              title="Cart"
              completed
            />

            <div className="mx-2 h-px flex-1 bg-indigo-200" />

            <CheckoutStep
              number="2"
              title="Checkout"
              active
            />

            <div className="mx-2 h-px flex-1 bg-gray-200" />

            <CheckoutStep
              number="3"
              title="Complete"
            />
          </div>
        </div>
      </section>

      {/* CHECKOUT CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* SHIPPING ADDRESS */}
            <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-4 border-b border-gray-100 px-5 py-5 sm:px-7">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <MapPin className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="font-extrabold text-gray-950">
                    Shipping address
                  </h2>

                  <p className="mt-0.5 text-sm text-gray-500">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <label className="mb-2.5 block text-sm font-bold text-gray-700">
                  Full delivery address
                </label>

                <div className="relative">
                  <textarea
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    rows={5}
                    placeholder="House / Flat No, Street, Area, City, State, Pincode"
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm leading-6 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />

                  <MapPin className="absolute bottom-4 right-4 h-5 w-5 text-gray-300" />
                </div>

                <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-gray-400">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                  Enter a complete address with your
                  pincode to help sellers dispatch your
                  order correctly.
                </div>
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <ShoppingBag className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-gray-950">
                      Your items
                    </h2>

                    <p className="mt-0.5 text-sm text-gray-500">
                      {cart.totalItems}{" "}
                      {cart.totalItems === 1
                        ? "item"
                        : "items"}{" "}
                      in this order
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/cart")}
                  className="hidden text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-700 sm:block"
                >
                  Edit cart
                </button>
              </div>

              <div className="divide-y divide-gray-100 px-5 sm:px-7">
                {cart.items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-4 py-5"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <PackageCheck className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-bold text-gray-900">
                        {item.productName}
                      </h3>

                      <div className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                        Qty: {item.quantity}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-gray-950">
                        ₹{item.subtotal.toFixed(0)}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        ₹{item.price.toFixed(0)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-7">
                <Truck className="h-5 w-5 text-emerald-600" />

                <p className="text-sm font-semibold text-gray-600">
                  Free shipping on this order
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              {/* SUMMARY HEADER */}
              <div className="bg-[#101525] px-6 py-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <CreditCard className="h-5 w-5 text-indigo-300" />
                  </div>

                  <div>
                    <h2 className="font-extrabold">
                      Payment summary
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Review before you pay
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* COUPON */}
                <div className="mb-6 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-indigo-600" />

                    <p className="text-sm font-extrabold text-gray-900">
                      Have a coupon?
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={couponCode}
                      disabled={couponApplied}
                      onChange={(e) => {
                        setCouponCode(
                          e.target.value.toUpperCase()
                        );

                        setCouponError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          applyCoupon();
                        }
                      }}
                      className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold uppercase outline-none transition-all placeholder:font-normal placeholder:normal-case focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-50"
                    />

                    <button
                      onClick={applyCoupon}
                      disabled={
                        !couponCode.trim() ||
                        applyingCoupon ||
                        couponApplied
                      }
                      className="flex min-w-[78px] items-center justify-center rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {applyingCoupon ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : couponApplied ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>

                  {couponError && (
                    <p className="mt-2.5 text-xs font-semibold text-red-600">
                      {couponError}
                    </p>
                  )}

                  {couponApplied && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-100 px-3 py-2.5 text-emerald-700">
                      <Gift className="h-4 w-4 shrink-0" />

                      <p className="text-xs font-bold">
                        Coupon applied! You saved ₹
                        {discount.toFixed(0)}
                      </p>
                    </div>
                  )}
                </div>

                {/* PRICE DETAILS */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-bold text-gray-900">
                      ₹{cart.totalAmount.toFixed(0)}
                    </span>
                  </div>

                  {couponApplied && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-600">
                        Coupon discount
                      </span>

                      <span className="font-bold text-emerald-600">
                        -₹{discount.toFixed(0)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Shipping
                    </span>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-600">
                      FREE
                    </span>
                  </div>
                </div>

                <div className="my-5 border-t border-dashed border-gray-200" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-500">
                      Total to pay
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Inclusive of all charges
                    </p>
                  </div>

                  <p className="text-3xl font-black tracking-tight text-gray-950">
                    ₹{finalTotal.toFixed(0)}
                  </p>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-3.5 text-sm font-semibold text-red-600">
                    {error}
                  </div>
                )}

                {/* PAY BUTTON */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="group mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-extrabold text-white shadow-[0_14px_35px_rgba(79,70,229,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,70,229,0.35)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {placing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing payment...
                    </>
                  ) : (
                    <>
                      <LockKeyhole className="h-4 w-4" />
                      Pay ₹{finalTotal.toFixed(0)}
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* PAYMENT TRUST */}
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Secured by Razorpay
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-600" />

                    <span className="text-[11px] font-bold text-gray-600">
                      Secure checkout
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3">
                    <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" />

                    <span className="text-[11px] font-bold text-gray-600">
                      Verified payment
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 px-4 text-center text-xs leading-5 text-gray-400">
              By completing this purchase, you agree to
              Shopzuu&apos;s order and payment terms.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function CheckoutStep({
  number,
  title,
  active = false,
  completed = false,
}: {
  number: string;
  title: string;
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
          completed
            ? "bg-emerald-500 text-white"
            : active
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {completed ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          number
        )}
      </div>

      <span
        className={`hidden text-xs font-bold sm:block ${
          active
            ? "text-indigo-600"
            : completed
            ? "text-gray-700"
            : "text-gray-400"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <main className="min-h-screen bg-[#f7f7fb]">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-4 w-24 animate-pulse rounded-full bg-gray-100" />

          <div className="mt-8 h-12 w-72 animate-pulse rounded-2xl bg-gray-100" />

          <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_400px] lg:px-8">
        <div className="space-y-6">
          <div className="h-72 animate-pulse rounded-[28px] bg-white" />

          <div className="h-80 animate-pulse rounded-[28px] bg-white" />
        </div>

        <div className="h-[540px] animate-pulse rounded-[30px] bg-white" />
      </div>
    </main>
  );
}