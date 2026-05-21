import { useState } from "react";
import { Download, FileSpreadsheet, FileText, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Magnet = {
  slug: string;
  title: string;
  desc: string;
  file: string;
  icon: "xlsx" | "pdf";
  accent: string;
};

const MAGNETS: Magnet[] = [
  {
    slug: "mba-roi-calculator-xlsx",
    title: "MBA ROI Calculator (Excel)",
    desc: "Plug in salary, fees & duration — instantly see payback period, 5-yr & 10-yr net gain. Used by 8,000+ aspirants.",
    file: "/lead-magnets/MBA-ROI-Calculator.xlsx",
    icon: "xlsx",
    accent: "from-success/15 to-success-soft border-success/20",
  },
  {
    slug: "top-50-mba-colleges-2026-pdf",
    title: "Top 50 MBA Colleges 2026 (PDF)",
    desc: "Rankings, fees, avg package & admission windows for India's top 50 B-schools — IIMs, ISB, FMS, XLRI and more.",
    file: "/lead-magnets/Top-50-MBA-Colleges-2026.pdf",
    icon: "pdf",
    accent: "from-primary/15 to-primary-soft border-primary/20",
  },
];

function MagnetCard({ m }: { m: Magnet }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await (supabase as any).from("lead_magnet_downloads").insert({
        email,
        name: name || null,
        phone: phone || null,
        magnet_slug: m.slug,
        source: typeof window !== "undefined" ? window.location.pathname : null,
      });
    } catch {
      /* still let them download */
    }
    setSubmitting(false);
    setDone(true);
    const a = document.createElement("a");
    a.href = m.file;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const Icon = m.icon === "xlsx" ? FileSpreadsheet : FileText;

  return (
    <div className={`rounded-2xl p-6 border bg-gradient-to-br ${m.accent}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-card flex items-center justify-center shadow-card">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3">
          {m.icon === "xlsx" ? "Free Excel" : "Free PDF"}
        </div>
      </div>
      <h3 className="font-display font-bold text-lg mb-1.5">{m.title}</h3>
      <p className="text-[13px] text-ink-2 leading-relaxed mb-4">{m.desc}</p>

      {done ? (
        <div className="bg-card rounded-xl p-4 border flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold">Download started</div>
            <a href={m.file} className="text-primary hover:underline text-xs">
              Click here if it didn't begin
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="bg-card rounded-xl p-4 space-y-2 border">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full px-3 py-2 border-[1.5px] border-border rounded-lg text-sm outline-none focus:border-primary"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full px-3 py-2 border-[1.5px] border-border rounded-lg text-sm outline-none focus:border-primary"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="numeric"
            placeholder="WhatsApp number (optional)"
            className="w-full px-3 py-2 border-[1.5px] border-border rounded-lg text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm px-4 py-2.5 rounded-lg transition disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            {submitting ? "Sending…" : `Get the ${m.icon.toUpperCase()}`}
          </button>
          <p className="text-[10.5px] text-ink-3 text-center pt-1">
            No spam. We'll only use your email to send MBA admission updates.
          </p>
        </form>
      )}
    </div>
  );
}

export function LeadMagnetsSection() {
  return (
    <section className="max-w-[1180px] mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 bg-accent-soft text-accent text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
          📥 FREE DOWNLOADS
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-bold">
          Free MBA tools — used by <span className="text-primary">18,000+ aspirants</span>
        </h2>
        <p className="text-sm text-ink-3 mt-2">Built by our counsellors. No sign-up wall — just your email.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {MAGNETS.map((m) => <MagnetCard key={m.slug} m={m} />)}
      </div>
    </section>
  );
}
