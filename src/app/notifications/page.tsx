"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    api
      .get("/notifications")
      .then((res) => setNotifications(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: number) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Bell className="w-6 h-6" />
        Notifications
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No notifications yet.</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && markAsRead(n.id)}
              className={`p-4 rounded-xl border cursor-pointer ${
                n.isRead
                  ? "bg-white border-gray-200"
                  : "bg-indigo-50 border-indigo-200"
              }`}
            >
              <p className="font-medium text-gray-900">{n.title}</p>
              <p className="text-sm text-gray-600 mt-1">{n.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {n.createdAt.slice(0, 16).replace("T", " ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}