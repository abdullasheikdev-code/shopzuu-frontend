export default function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const dims = size === "large" ? 44 : 32;
  const textSize = size === "large" ? "text-3xl" : "text-2xl";

  return (
    <div className="flex items-center gap-2">
      <svg
        width={dims}
        height={dims}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="szGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Rounded square base */}
        <rect width="48" height="48" rx="12" fill="url(#szGrad)" />

        {/* Abstract monogram "S" built from two offset bolt-like strokes */}
        <path
          d="M32 14C32 14 26 12 20 14C15 15.7 15 20 19 21.5C23 23 29 22.5 31 25C33 27.5 31.5 32 26 33.5C20.5 35 15 33 15 33"
          stroke="#38BDF8"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M32 14C32 14 26 12 20 14C15 15.7 15 20 19 21.5C23 23 29 22.5 31 25C33 27.5 31.5 32 26 33.5C20.5 35 15 33 15 33"
          stroke="white"
          strokeOpacity="0.25"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          transform="translate(0.8, 0.8)"
        />
      </svg>

      <span className={`${textSize} font-bold tracking-tight`}>
        <span className="text-slate-900">Shop</span>
        <span className="text-sky-500">zuu</span>
      </span>
    </div>
  );
}