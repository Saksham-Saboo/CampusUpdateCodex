import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { waLink, WHATSAPP_DEFAULT_MSG } from "@/lib/whatsapp";

function WhatsAppIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.0049-.515 2.434-1.39.158-.328.158-.6.158-.946-.087-.43-1.232-.974-1.59-1.117z M16.084 4C9.43 4 4 9.428 4 16.084c0 2.62.788 5.13 2.305 7.293L4.6 28l4.85-1.575c2.077 1.176 4.42 1.83 6.633 1.83 6.654 0 12.083-5.427 12.083-12.084 0-3.21-1.245-6.226-3.51-8.49C22.41 5.413 19.32 4 16.084 4zm.085 2.084c2.69 0 5.21 1.04 7.115 2.946 1.904 1.904 2.945 4.434 2.945 7.124 0 5.534-4.527 10.018-10.06 10.018-1.847 0-3.65-.488-5.246-1.418l-.487-.273-3.21 1.04 1.07-3.124-.286-.487a9.926 9.926 0 0 1-1.518-5.276c.014-5.534 4.498-10.06 10.018-10.06z"/>
    </svg>
  );
}

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[300px] bg-card rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-[#25D366] text-white px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <WhatsAppIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">CampusUpdates Team</div>
              <div className="text-[11px] opacity-90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" /> Online now
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="opacity-80 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 text-sm bg-muted/40">
            <p className="text-ink-2 mb-3">
              👋 Hi! Need help picking the right MBA college? Chat with our counsellor on WhatsApp — usually replies in <b>2 min</b>.
            </p>
            <a
              href={waLink(WHATSAPP_DEFAULT_MSG)}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" /> Start chat on WhatsApp
            </a>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.5)] flex items-center justify-center hover:scale-105 active:scale-95 transition"
      >
        {pulse && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
        )}
        <WhatsAppIcon className="w-7 h-7 relative text-white" />
      </button>
    </>
  );
}
