"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, User, Store, LayoutDashboard, LogOut, Menu, Heart,Package} from "lucide-react";
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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 -ml-2 text-brand-dark hover:text-brand-pink transition-colors"
              aria-label="Browse categories"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>

            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-700">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 hover:text-brand-pink transition-colors"
            >
              <Menu className="w-4 h-4" />
              Browse
            </button>
            <Link href="/products" className="hover:text-brand-pink transition-colors">
              Shop
            </Link>
            {!user && (
              <Link href="/become-vendor" className="hover:text-brand-pink transition-colors">
                Sell on Shopzuu
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            {user?.role === "BUYER" && (
              <>
                <Link
                  href="/wishlist"
                  className="p-2 text-gray-600 hover:text-brand-pink transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5.5 h-5.5" />
                </Link>

                <Link
                  href="/orders"
                  className="p-2 text-gray-600 hover:text-brand-pink transition-colors"
                  aria-label="Orders"
                >
                  <Package className="w-5.5 h-5.5" />
                </Link>

                <Link
                  href="/cart"
                  className="relative p-2 text-gray-600 hover:text-brand-pink transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5.5 h-5.5" />
                  {itemCount > 0 && (
                    <span className="absolute top-0 right-0 bg-brand-pink text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user?.role === "VENDOR" && (
              <Link
                href="/vendor/dashboard"
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-brand-pink transition-colors px-2 py-2"
              >
                <Store className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user?.role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-brand-pink transition-colors px-2 py-2"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors p-2"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm font-bold bg-brand-dark text-white px-5 py-2.5 rounded-full hover:bg-brand-pink transition-colors"
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