import { useEffect, useRef, useState } from "react";
import { X, MessageCircle, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { waLink } from "@/lib/whatsapp";

type Props = {
  collegeId?: string;
  collegeName: string;
};

const DISMISS_KEY = "cu_exit_intent_dismissed";

export function ExitIntentBrochurePopup({ collegeId, collegeName }: Props) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    const trigger = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      setOpen(true);
    };
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };
    // Mobile fallback: trigger after 25s on page if not dismissed
    const fallback = window.setTimeout(trigger, 25000);
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      clearTimeout(fallback);
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ""))) return;
    setSubmitting(true);
    try {
      await (supabase as any).from("brochure_requests").insert({
        college_id: collegeId ?? null,
        college_name: collegeName,
        phone: phone.replace(/\s+/g, ""),
        name: name || null,
        source: "exit_intent",
      });
    } catch {
      /* table may not exist yet — fall through and still open WhatsApp */
    }
    setSubmitting(false);
    setDone(true);
    sessionStorage.setItem(DISMISS_KEY, "1");
    window.open(
      waLink(`Hi! Please send me the brochure & fee details for ${collegeName}.`),
      "_blank",
      "noopener",
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in">
      <div className="bg-card max-w-md w-full rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="bg-gradient-to-br from-[#1043E9] to-[#7C3AED] text-white p-6 relative">
          <button
            onClick={dismiss}
            aria-label="Close"
            className="absolute top-3 right-3 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl font-bold leading-tight">
            Wait! Get the <span className="text-[#FFD86B]">{collegeName}</span> brochure on WhatsApp
          </h3>
          <p className="text-sm text-white/85 mt-2">
            Fees, placements, scholarships & cutoffs — in 1 PDF, sent instantly.
          </p>
        </div>

        {done ? (
          <div className="p-6 text-center">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-sm text-ink-2">Opening WhatsApp… your brochure is on the way.</p>
            <button
              onClick={dismiss}
              className="mt-4 text-xs text-ink-3 hover:text-primary"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            <div>
              <label className="text-xs font-semibold text-ink-2 block mb-1">Your name (optional)</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 border-[1.5px] border-border rounded-lg text-sm outline-none focus:border-primary"
                placeholder="Ananya Sharma"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-2 block mb-1">WhatsApp number</label>
              <div className="flex">
                <span className="px-3 py-2.5 bg-muted border-[1.5px] border-r-0 border-border rounded-l-lg text-sm text-ink-2">+91</span>
                <input
                  required
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-3 py-2.5 border-[1.5px] border-border rounded-r-lg text-sm outline-none focus:border-primary"
                  placeholder="9876543210"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-semibold text-sm px-4 py-3 rounded-xl transition disabled:opacity-60"
            >
              <MessageCircle className="w-4 h-4" />
              {submitting ? "Sending…" : "Send brochure on WhatsApp"}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="w-full text-xs text-ink-3 hover:text-ink-2 pt-1"
            >
              No thanks, I'll browse more
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
