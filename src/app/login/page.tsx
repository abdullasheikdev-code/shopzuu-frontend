"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import api from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const data = res.data.data;

      saveAuth(data.token, {
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        vendorId: data.vendorId,
      });

      if (data.role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else if (data.role === "VENDOR") {
        window.location.href = "/vendor/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Check your credentials."
      );

      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#f7f7fb]">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-indigo-200/40 blur-[130px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-200/40 blur-[130px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-[1440px] lg:grid-cols-[0.95fr_1.05fr]">
        {/* LEFT BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-[#0b1020] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
          {/* Decorative glow */}
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-600/30 blur-[120px]" />

          <div className="absolute -right-32 bottom-0 h-[450px] w-[450px] rounded-full bg-violet-500/20 blur-[130px]" />

          <div className="absolute right-16 top-20 h-36 w-36 rounded-full border border-white/5" />

          <div className="absolute right-28 top-32 h-16 w-16 rounded-full border border-white/10" />

          {/* Brand */}
          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-950/30">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <span className="text-2xl font-black tracking-[-0.04em] text-white">
                Shopzuu
              </span>
            </Link>
          </div>

          {/* Main content */}
          <div className="relative max-w-xl py-16">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold text-indigo-200 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              Welcome back to Shopzuu
            </div>

            <h1 className="text-5xl font-black leading-[1.03] tracking-[-0.05em] text-white xl:text-6xl">
              Your marketplace
              <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
                is waiting.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-slate-300">
              Sign in to discover products, manage your
              orders, track deliveries, and continue your
              Shopzuu journey.
            </p>

            {/* Benefits */}
            <div className="mt-10 space-y-4">
              <BenefitItem
                icon={
                  <ShoppingBag className="h-4 w-4" />
                }
                text="Discover products from growing sellers"
              />

              <BenefitItem
                icon={
                  <ShieldCheck className="h-4 w-4" />
                }
                text="Secure shopping and protected accounts"
              />

              <BenefitItem
                icon={<Store className="h-4 w-4" />}
                text="One account for buyers and sellers"
              />
            </div>
          </div>

          {/* Bottom trust */}
          <div className="relative flex items-center gap-3 text-xs text-slate-400">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full border-2 border-[#0b1020] bg-indigo-400" />
              <div className="h-8 w-8 rounded-full border-2 border-[#0b1020] bg-violet-400" />
              <div className="h-8 w-8 rounded-full border-2 border-[#0b1020] bg-slate-400" />
            </div>

            <span>
              Built for the Shopzuu community
            </span>
          </div>
        </section>

        {/* RIGHT LOGIN AREA */}
        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
          <div className="w-full max-w-[500px]">
            {/* Mobile brand */}
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-950 text-white shadow-lg">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <span className="text-2xl font-black tracking-[-0.04em] text-gray-950">
                Shopzuu
              </span>
            </Link>

            {/* Heading */}
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
                Welcome back
              </p>

              <h2 className="text-4xl font-black tracking-[-0.045em] text-gray-950 sm:text-5xl">
                Sign in to Shopzuu
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
                Enter your account details to continue.
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <span className="text-sm font-black">
                    !
                  </span>
                </div>

                <p className="text-sm font-semibold leading-6 text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* LOGIN FORM */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
              autoComplete="on"
            >
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-extrabold text-gray-800"
                >
                  Email address
                </label>

                <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-600" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    placeholder="you@example.com"
                    className="h-14 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-extrabold text-gray-800"
                  >
                    Password
                  </label>

                  <span className="text-xs font-semibold text-gray-400">
                    Keep it secure
                  </span>
                </div>

                <div className="group relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-600" />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter your password"
                    className="h-14 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-12 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-400 transition-colors hover:text-gray-700"
                    tabIndex={-1}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-6 text-sm font-extrabold text-white shadow-xl shadow-gray-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing you in...
                  </>
                ) : (
                  <>
                    Sign in

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-400">
                Or continue with
              </span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* SOCIAL LOGIN */}
            <div className="grid grid-cols-3 gap-3">
              {/* GOOGLE */}
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Google sign-in needs OAuth setup — see chat for instructions"
                  )
                }
                className="group flex h-13 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-3.5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                aria-label="Continue with Google"
              >
                <GoogleIcon />

                <span className="hidden sm:inline">
                  Google
                </span>
              </button>

              {/* APPLE */}
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Apple sign-in needs OAuth setup — see chat for instructions"
                  )
                }
                className="group flex h-13 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-3.5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                aria-label="Continue with Apple"
              >
                <AppleIcon />

                <span className="hidden sm:inline">
                  Apple
                </span>
              </button>

              {/* MICROSOFT */}
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Microsoft sign-in needs OAuth setup — see chat for instructions"
                  )
                }
                className="group flex h-13 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-3.5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                aria-label="Continue with Microsoft"
              >
                <MicrosoftIcon />

                <span className="hidden sm:inline">
                  Microsoft
                </span>
              </button>
            </div>

            {/* REGISTER */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-sm text-gray-600">
                New to Shopzuu?{" "}
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-1 font-extrabold text-indigo-600 transition-colors hover:text-indigo-700"
                >
                  Create an account

                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </p>
            </div>

            {/* SECURITY */}
            <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs font-medium text-gray-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Secure account access protected by Shopzuu
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function BenefitItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-indigo-300">
        {icon}
      </div>

      <span>{text}</span>

      <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />

      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />

      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />

      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-2.05 1.61-3.08 1.53-.135-1.11.43-2.27 1.13-3.04.78-.9 2.13-1.59 3.13-1.57zm3.96 16.59c-.736 1.07-1.5 2.13-2.72 2.15-1.2.02-1.6-.71-2.97-.71-1.37 0-1.81.69-2.95.73-1.19.04-2.07-1.13-2.81-2.2-1.5-2.18-2.65-6.15-1.11-8.84.76-1.32 2.13-2.16 3.62-2.18 1.18-.02 1.94.79 2.93.79.97 0 1.65-.79 2.95-.79 1.27.02 2.6.7 3.36 1.9-2.96 1.73-2.48 5.85.7 7.15z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 23 23"
    >
      <rect
        x="1"
        y="1"
        width="10"
        height="10"
        fill="#F25022"
      />

      <rect
        x="12"
        y="1"
        width="10"
        height="10"
        fill="#7FBA00"
      />

      <rect
        x="1"
        y="12"
        width="10"
        height="10"
        fill="#00A4EF"
      />

      <rect
        x="12"
        y="12"
        width="10"
        height="10"
        fill="#FFB900"
      />
    </svg>
  );
}