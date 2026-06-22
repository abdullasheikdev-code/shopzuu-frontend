"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Cart } from "@/lib/types";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
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
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    setUpdating(cartItemId);
    try {
      const res = await api.put(
        `/cart/update/${cartItemId}?quantity=${quantity}`
      );
      setCart(res.data.data);
      setItemCount(res.data.data.totalItems);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartItemId: number) => {
    setUpdating(cartItemId);
    try {
      const res = await api.delete(`/cart/remove/${cartItemId}`);
      setCart(res.data.data);
      setItemCount(res.data.data.totalItems);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-12">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Browse products and add something you like.
        </p>
        <Link
          href="/products"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 inline-block"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Your Cart ({cart.totalItems})
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.cartItemId}
              className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  ₹{item.price.toFixed(0)} each
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      disabled={updating === item.cartItemId}
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity - 1)
                      }
                      className="p-2 hover:bg-gray-50"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      disabled={updating === item.cartItemId}
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity + 1)
                      }
                      className="p-2 hover:bg-gray-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    disabled={updating === item.cartItemId}
                    onClick={() => removeItem(item.cartItemId)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-right font-semibold text-gray-900">
                ₹{item.subtotal.toFixed(0)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
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

          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}