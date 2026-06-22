"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Order } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    api.get("/orders/my-orders").then((res) => {
      const found = res.data.data.find((o: Order) => o.id === Number(id));
      setOrder(found || null);
    });
  }, [id]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Order placed successfully!
      </h1>
      {order && (
        <p className="text-gray-600 mb-1">
          Order number: <strong>{order.orderNumber}</strong>
        </p>
      )}
      <p className="text-gray-500 mb-8">
        You'll receive updates as your order is processed.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/orders"
          className="border border-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50"
        >
          View Orders
        </Link>
        <Link
          href="/products"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}