"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, User, Store, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { getAuthUser, logout, AuthUser } from "@/lib/auth";
import { useCartStore } from "@/lib/cartStore";
import api from "@/lib/api";
import CategoryDrawer from "./CategoryDrawer";
import Logo from "./Logo";

export default function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount);
  const setItemCount = useCartStore((s) => s.setItemCount);

  useEffect(() => {
    const u = getAuthUser();
    setUser(u);

    if (u && u.role === "BUYER") {
      api
        .get("/cart")
        .then((res) => setItemCount(res.data.data.totalItems))
        .catch(() => {});
    }
  }, [setItemCount]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 -ml-2 text-gray-700 hover:text-indigo-600 lg:hidden"
              aria-label="Browse categories"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>

            <Link href="/">
            <Logo/>
            </Link>

        
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 hover:text-indigo-600"
            >
              <Menu className="w-4 h-4" />
              Browse
            </button>
            <Link href="/products" className="hover:text-indigo-600">
              Shop
            </Link>
            {!user && (
              <Link href="/become-vendor" className="hover:text-indigo-600">
                Sell on Shopzuu
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user?.role === "BUYER" && (
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {user?.role === "VENDOR" && (
              <Link
                href="/vendor/dashboard"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                <Store className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user?.role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <CategoryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}