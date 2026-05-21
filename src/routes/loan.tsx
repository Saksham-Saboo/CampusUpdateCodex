import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { TestimonialsSection } from "@/components/site/lead-gen/TestimonialsSection";
import { Button } from "@/components/ui/button";
import { LoanInquiryModal } from "@/components/site/LoanInquiryModal";
import { EmiCalculator } from "@/components/site/EmiCalculator";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, UserCheck, Phone, CheckCircle2, ShieldCheck, Zap, Banknote, Users, Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/loan")({
  head: () => ({ meta: [
    { title: "Education Loans for MBA — CampusUpdates" },
    { name: "description", content: "Get expert guidance on education loans from SBI, HDFC, ICICI, Axis, PNB, BOB. No processing fee. Free assistance." },
  ]}),
  component: LoanPage,
});

const STEPS = [
  { i: ClipboardList, t: "Fill Eligibility Form", d: "Share your basic details in 2 minutes." },
  { i: UserCheck, t: "Expert Reviews Your Profile", d: "Our loan team checks your eligibility across banks." },
  { i: Phone, t: "Bank Connects With You", d: "Pre-shortlisted banks reach out with offers." },
  { i: Banknote, t: "Loan Gets Disbursed", d: "Sign, submit documents, get funds in your account." },
];

const BANKS = [
  { n: "SBI", b: "Up to ₹40L at competitive rates" },
  { n: "HDFC Bank", b: "Quick approval in 7 days" },
  { n: "ICICI Bank", b: "No collateral up to ₹7.5L" },
  { n: "Axis Bank", b: "Flexible repayment up to 15 yrs" },
  { n: "PNB", b: "Lower interest for women applicants" },
  { n: "Bank of Baroda", b: "Tax benefits under Section 80E" },
];

const WHY = [
  { i: ShieldCheck, t: "No Processing Fee", d: "We never charge you a rupee — banks pay us." },
  { i: UserCheck, t: "Expert Guidance", d: "Dedicated loan advisor through the journey." },
  { i: Zap, t: "Faster Approval", d: "Pre-verified profiles get sanctioned 3× faster." },
  { i: Users, t: "Multiple Bank Options", d: "Compare 6+ banks and pick the best offer." },
];

function LoanPage() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [collegeName, setCollegeName] = useState<string | undefined>();

  const trigger = (name?: string) => { setCollegeName(name); setOpen(true); };

  return (
    <SiteShell>
      {/* HERO */}
      <section className="gradient-hero pt-16 pb-20 px-6">
        <div className="max-w-[980px] mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5">
            <Banknote className="w-3.5 h-3.5" /> EDUCATION LOAN ASSISTANCE
          </span>
          <h1 className="font-display text-[2.5rem] md:text-[3rem] font-extrabold text-white leading-[1.12] mb-4 tracking-[-0.02em]">
            Fund Your <span className="text-[#93C5FD]">MBA Dream</span>
          </h1>
          <p className="text-white/75 text-[1.05rem] mb-7 max-w-[640px] mx-auto leading-relaxed">
            Get free expert guidance on education loans from top banks across India.
          </p>
          <Button size="lg" onClick={() => trigger()} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5 shadow-[0_8px_24px_rgba(240,90,38,0.4)]">
            Check Loan Eligibility <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-[1180px] mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-ink-3">Four simple steps from inquiry to disbursement</p>
        </div>
        <div className="grid md:grid-cols-4 gap-5">
          {STEPS.map(({ i: I, t, d }, idx) => (
            <div key={t} className="bg-card border rounded-2xl p-6 relative hover:shadow-pop transition">
              <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-3"><I className="w-6 h-6" /></div>
              <div className="text-xs font-semibold text-primary mb-1">STEP {idx + 1}</div>
              <h3 className="font-display font-bold mb-1.5">{t}</h3>
              <p className="text-sm text-ink-3">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-muted/40 border-y">
        <div className="max-w-[1180px] mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Loan Partners</h2>
            <p className="text-ink-3">Apply through India's most trusted banks</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BANKS.map((b) => (
              <div key={b.n} className="bg-card border rounded-2xl p-5 hover:border-primary hover:shadow-pop transition">
                <div className="font-display text-lg font-bold mb-1">{b.n}</div>
                <div className="text-sm text-ink-3 mb-4 flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />{b.b}</div>
                <Button size="sm" variant="outline" onClick={() => trigger()} className="w-full">Apply</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI CALCULATOR — gated */}
      {user ? (
        <EmiCalculator />
      ) : (
        <section className="bg-muted/40 border-y">
          <div className="max-w-[1180px] mx-auto px-6 py-14">
            <div className="bg-card border-2 border-dashed border-primary/30 rounded-2xl p-10 md:p-14 text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-primary-soft mx-auto flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-extrabold mb-2">Sign in to use the EMI Calculator</h2>
              <p className="text-ink-3 mb-6">Free for all members — also unlocks ROI calculator, college recommender and SOP reviewer.</p>
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                  <Sparkles className="w-4 h-4" /> Sign in / Create free account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* WHY */}
      <section className="max-w-[1180px] mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Why Apply Through Us</h2>
          <p className="text-ink-3">Built for MBA aspirants, not bankers</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {WHY.map(({ i: I, t, d }) => (
            <div key={t} className="bg-card border rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center mx-auto mb-3"><I className="w-6 h-6" /></div>
              <h3 className="font-display font-bold mb-1.5">{t}</h3>
              <p className="text-sm text-ink-3">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STICKY BAR */}
      <div className="sticky bottom-0 z-40 bg-card border-t shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-[1180px] mx-auto px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="font-display font-semibold text-sm md:text-base">💸 Get Free Loan Assistance</div>
          <Button onClick={() => trigger()} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1">
            Apply Now <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <TestimonialsSection variant="loan" title="Loans they actually got — fast" />

      <LoanInquiryModal open={open} onOpenChange={setOpen} collegeName={collegeName} />
    </SiteShell>
  );
}
