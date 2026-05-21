export function Topbar() {
  return (
    <div className="bg-surface-dark text-surface-dark-foreground text-[12.5px] py-2 tracking-[0.01em]">
      <div className="max-w-[1240px] mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="bg-gold text-[#0F1623] font-bold px-2.5 py-0.5 rounded-full text-[11px]">LIVE</span>
          <span>🔥 Admissions July 2025 closing in <strong className="text-warning">12 days</strong> · Direct admit available</span>
        </div>
        <div className="hidden md:flex gap-5 opacity-65 text-[12px]">
          <span className="hover:opacity-100 cursor-pointer transition-opacity">📞 +91 90000 00000</span>
          <span className="hover:opacity-100 cursor-pointer transition-opacity">✉️ hello@campusupdates.in</span>
          <span className="hover:opacity-100 cursor-pointer transition-opacity">🇮🇳 IN · EN</span>
        </div>
      </div>
    </div>
  );
}
