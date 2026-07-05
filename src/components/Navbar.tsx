"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  User,
  Store,
  LayoutDashboard,
  LogOut,
  Menu,
  Heart,
  Package,
  ChevronDown,
} from "lucide-react";

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
    const currentUser = getAuthUser();
    setUser(currentUser);

    if (currentUser?.role === "BUYER") {
      api
        .get("/cart")
        .then((res) => {
          setItemCount(res.data.data.totalItems);
        })
        .catch(() => {});
    }
  }, [setItemCount]);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="border-b border-gray-200/80 bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
          <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

            {/* LEFT — MENU + LOGO */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-200 hover:bg-pink-50 hover:text-brand-pink hover:shadow-md"
                aria-label="Browse categories"
              >
                <Menu className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </button>

              <Link
                href="/"
                className="flex shrink-0 items-center transition-opacity hover:opacity-90"
                aria-label="Shopzuu home"
              >
                <Logo />
              </Link>
            </div>

            {/* CENTER NAVIGATION */}
            <nav className="hidden items-center gap-1 rounded-full border border-gray-200/80 bg-gray-50/80 p-1.5 lg:flex">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-white hover:text-brand-pink hover:shadow-sm"
              >
                Browse
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              <Link
                href="/products"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-white hover:text-brand-pink hover:shadow-sm"
              >
                Shop
              </Link>

              {!user && (
                <Link
                  href="/become-vendor"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-white hover:text-brand-pink hover:shadow-sm"
                >
                  Sell on Shopzuu
                </Link>
              )}
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

              {/* BUYER ACTIONS */}
              {user?.role === "BUYER" && (
                <>
                  <NavIcon
                    href="/wishlist"
                    label="Wishlist"
                    icon={<Heart className="h-5 w-5" />}
                  />

                  <NavIcon
                    href="/orders"
                    label="Orders"
                    icon={<Package className="h-5 w-5" />}
                  />

                  <Link
                    href="/cart"
                    className="group relative flex h-11 w-11 items-center justify-center rounded-2xl text-gray-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-50 hover:text-brand-pink"
                    aria-label="Cart"
                  >
                    <ShoppingCart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

                    {itemCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-brand-pink px-1 text-[10px] font-extrabold leading-none text-white shadow-sm">
                        {itemCount > 99 ? "99+" : itemCount}
                      </span>
                    )}
                  </Link>

                  <div className="mx-1 hidden h-7 w-px bg-gray-200 sm:block" />
                </>
              )}

              {/* VENDOR DASHBOARD */}
              {user?.role === "VENDOR" && (
                <Link
                  href="/vendor/dashboard"
                  className="flex h-11 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3.5 text-sm font-bold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-200 hover:bg-pink-50 hover:text-brand-pink hover:shadow-md"
                >
                  <Store className="h-4.5 w-4.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}

              {/* ADMIN DASHBOARD */}
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  className="flex h-11 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3.5 text-sm font-bold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-200 hover:bg-pink-50 hover:text-brand-pink hover:shadow-md"
                >
                  <LayoutDashboard className="h-4.5 w-4.5" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}

              {/* AUTH */}
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="group flex h-11 items-center gap-2 rounded-2xl px-3 text-sm font-semibold text-gray-500 transition-all duration-300 hover:bg-red-50 hover:text-red-600 sm:px-4"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="group flex h-11 items-center gap-2 rounded-full bg-brand-dark px-4 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-pink hover:shadow-[0_10px_25px_rgba(236,72,153,0.25)] sm:px-6"
                >
                  <User className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <CategoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}

function NavIcon({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-11 w-11 items-center justify-center rounded-2xl text-gray-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-50 hover:text-brand-pink"
      aria-label={label}
      title={label}
    >
      <span className="transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>

      <span className="pointer-events-none absolute top-[52px] hidden whitespace-nowrap rounded-lg bg-gray-950 px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 lg:block">
        {label}
      </span>
    </Link>
  );
}