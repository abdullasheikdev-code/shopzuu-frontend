export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Shopzuu logo icon */}
      <div className="relative flex h-11 w-10 items-center justify-center">

        {/* Bag handle */}
        <div className="absolute top-0 h-4 w-6 rounded-t-full border-[3px] border-blue-500 border-b-0" />

        {/* Shopping bag */}
        <div className="absolute bottom-0 h-8 w-9 overflow-hidden rounded-[8px] bg-gradient-to-br from-[#071B5A] via-[#0757D9] to-[#00C2FF] shadow-lg">

          {/* Signature Z-flow */}
          <div className="absolute -left-2 top-[10px] h-[5px] w-14 -rotate-[15deg] rounded-full bg-cyan-300" />

          <div className="absolute -left-2 top-[18px] h-[5px] w-14 -rotate-[15deg] rounded-full bg-blue-300" />

          <div className="absolute -left-2 top-[26px] h-[5px] w-14 -rotate-[15deg] rounded-full bg-white/80" />
        </div>

        {/* Sparkle */}
        <span className="absolute -right-1 top-1 text-[13px] text-cyan-400">
          ✦
        </span>
      </div>

      {/* Brand name */}
      <span className="text-[25px] font-black tracking-[-0.04em] text-[#082B7A]">
        shop<span className="text-[#0878F9]">zuu</span>
      </span>
    </div>
  );
}