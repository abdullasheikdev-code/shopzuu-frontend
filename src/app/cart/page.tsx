"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Cart } from "@/lib/types";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  PackageCheck,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { isAuthenticated } from "@/lib/auth";

export default function CartPage() {
  const router = useRouter();

  const setItemCount = useCartStore((s) => s.setItemCount);

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);

    try {
      const res = await api.get("/cart");

      setCart(res.data.data);
      setItemCount(res.data.data.totalItems);
    } catch (error) {
      console.error("Cart Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    cartItemId: number,
    quantity: number
  ) => {
    if (quantity < 1) return;

    setUpdating(cartItemId);

    try {
      const res = await api.put(
        `/cart/update/${cartItemId}?quantity=${quantity}`
      );

      setCart(res.data.data);
      setItemCount(res.data.data.totalItems);
    } catch (error) {
      console.error("Update Cart Error:", error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartItemId: number) => {
    setUpdating(cartItemId);

    try {
      const res = await api.delete(
        `/cart/remove/${cartItemId}`
      );

      setCart(res.data.data);
      setItemCount(res.data.data.totalItems);
    } catch (error) {
      console.error("Remove Cart Item Error:", error);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <CartSkeleton />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-[75vh] bg-[#f8fafc] px-4 py-16 sm:py-24">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-200 blur-3xl" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-[30px] border border-slate-200 bg-white shadow-xl">
              <ShoppingBag className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-blue-600">
            Your Shopzuu bag
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Your cart is empty
          </h1>

          <p className="mt-4 max-w-md leading-7 text-slate-500">
            Discover something special from independent sellers
            across the Shopzuu marketplace.
          </p>

          <Link
            href="/products"
            className="group mt-8 flex h-14 items-center gap-2 rounded-full bg-slate-950 px-7 text-sm font-black text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-blue-600"
          >
            Start shopping

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">

      {/* HEADER */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Continue shopping
          </Link>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                Your Shopzuu bag
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Shopping cart
              </h1>
            </div>

            <p className="text-sm font-semibold text-slate-500">
              {cart.totalItems}{" "}
              {cart.totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>
      </section>

      {/* CART CONTENT */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-start">

          {/* ITEMS */}

          <div className="space-y-4">
            {cart.items.map((item) => {
              const isUpdating =
                updating === item.cartItemId;

              return (
                <div
                  key={item.cartItemId}
                  className={`group relative overflow-hidden rounded-[24px] border bg-white p-4 transition-all duration-300 sm:p-5 ${
                    isUpdating
                      ? "border-blue-200 opacity-70"
                      : "border-slate-200 hover:border-blue-200 hover:shadow-[0_16px_45px_rgba(15,23,42,0.08)]"
                  }`}
                >
                  {isUpdating && (
                    <div className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    </div>
                  )}

                  <div className="flex gap-4 sm:gap-6">

                    {/* IMAGE */}

                    <Link
                      href={`/products/${item.productId}`}
                      className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-36 sm:w-32"
                    >
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-7 w-7 text-slate-300" />
                        </div>
                      )}
                    </Link>

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">

                      <div className="flex gap-3">

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">
                            Shopzuu product
                          </p>

                          <Link
                            href={`/products/${item.productId}`}
                            className="mt-1 block line-clamp-2 text-base font-black leading-6 text-slate-950 transition hover:text-blue-600 sm:text-lg"
                          >
                            {item.productName}
                          </Link>

                          <p className="mt-2 text-sm font-semibold text-slate-500">
                            ₹{item.price.toFixed(0)} each
                          </p>
                        </div>

                        <p className="hidden shrink-0 text-lg font-black text-slate-950 sm:block">
                          ₹{item.subtotal.toFixed(0)}
                        </p>
                      </div>

                      {/* ACTIONS */}

                      <div className="mt-5 flex items-end justify-between gap-3">

                        {/* QUANTITY */}

                        <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50">
                          <button
                            disabled={
                              isUpdating ||
                              item.quantity <= 1
                            }
                            onClick={() =>
                              updateQuantity(
                                item.cartItemId,
                                item.quantity - 1
                              )
                            }
                            className="flex h-full w-10 items-center justify-center rounded-l-xl text-slate-600 transition hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="min-w-9 text-center text-sm font-black text-slate-950">
                            {item.quantity}
                          </span>

                          <button
                            disabled={isUpdating}
                            onClick={() =>
                              updateQuantity(
                                item.cartItemId,
                                item.quantity + 1
                              )
                            }
                            className="flex h-full w-10 items-center justify-center rounded-r-xl text-slate-600 transition hover:bg-white hover:text-blue-600 disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <p className="font-black text-slate-950 sm:hidden">
                            ₹{item.subtotal.toFixed(0)}
                          </p>

                          <button
                            disabled={isUpdating}
                            onClick={() =>
                              removeItem(item.cartItemId)
                            }
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 transition hover:text-red-600 disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ORDER SUMMARY */}

          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-xl font-black text-slate-950">
                  Order summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review your order before checkout.
                </p>
              </div>

              <div className="p-6">

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-500">
                      Subtotal
                    </span>

                    <span className="font-bold text-slate-900">
                      ₹{cart.totalAmount.toFixed(0)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-500">
                      Shipping
                    </span>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                      FREE
                    </span>
                  </div>
                </div>

                <div className="my-6 border-t border-dashed border-slate-200" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-black text-slate-950">
                      Total
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Inclusive of applicable taxes
                    </p>
                  </div>

                  <span className="text-3xl font-black tracking-tight text-slate-950">
                    ₹{cart.totalAmount.toFixed(0)}
                  </span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="group mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-950/15 transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/20"
                >
                  Proceed to checkout

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Secure checkout
                </div>
              </div>
            </div>

            {/* TRUST */}

            <div className="mt-4 grid grid-cols-3 gap-2">
              <TrustBox
                icon={<ShieldCheck className="h-5 w-5" />}
                text="Secure"
              />

              <TrustBox
                icon={<Truck className="h-5 w-5" />}
                text="Delivery"
              />

              <TrustBox
                icon={<PackageCheck className="h-5 w-5" />}
                text="Tracked"
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function TrustBox({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-4 text-center">
      <div className="text-blue-600">
        {icon}
      </div>

      <p className="mt-2 text-[11px] font-black text-slate-700">
        {text}
      </p>
    </div>
  );
}

function CartSkeleton() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-12 w-72 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_390px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-[24px] bg-slate-200"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-[26px] bg-slate-200" />
      </div>
    </main>
  );
}