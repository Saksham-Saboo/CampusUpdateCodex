import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { TestimonialsSection } from "@/components/site/lead-gen/TestimonialsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { counsellingLeadSchema, submitCounsellingLead } from "@/lib/counselling";
import { toast } from "sonner";
import { Sparkles, ShieldCheck, Clock, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/counselling")({
  head: () => ({ meta: [{ title: "Free MBA Counselling — CampusUpdates" }, { name: "description", content: "Get a personalised MBA shortlist in 24 hours from verified counsellors. Free." }] }),
  component: Counselling,
});

function Counselling() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = counsellingLeadSchema.safeParse(raw);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    try {
      await submitCounsellingLead({ data: parsed.data });
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      return;
    }
    setLoading(false);
    setDone(true);
    toast.success("Got it! Our counsellor will reach out within 24 hours.");
  };

  return (
    <SiteShell>
      <section className="gradient-hero">
        <div className="max-w-[1180px] mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              <Sparkles className="w-3 h-3" /> 100% FREE • NO SPAM
            </span>
            <h1 className="font-display text-4xl font-extrabold mb-3">Get Your MBA Shortlist in 24 Hours</h1>
            <p className="text-white/80 mb-6">Fill the form. Our verified counsellors will call you with a personalised shortlist matched to your profile, budget & goals.</p>
            <ul className="space-y-3 text-sm">
              {[
                [ShieldCheck, "Zero counselling fee. Forever."],
                [Clock, "Reply within 4 working hours."],
                [MessageCircle, "Talk on WhatsApp, call or video."],
              ].map(([I, t]: any, i) => (
                <li key={i} className="flex items-center gap-3"><I className="w-5 h-5 text-blue-300" /> {t}</li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-2xl p-7 shadow-pop">
            {done ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto bg-success-soft rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">You're all set!</h3>
                <p className="text-ink-3 text-sm">Our counsellor will reach you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <h3 className="font-display text-lg font-bold mb-2">Free Counselling Form</h3>
                <Field name="full_name" label="Full name" required />
                <div className="grid grid-cols-2 gap-3">
                  <Field name="email" label="Email" type="email" required />
                  <Field name="phone" label="Phone" required placeholder="+91" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field name="city" label="City" />
                  <Select name="degree" label="Looking for" options={["MBA", "Online MBA", "Executive MBA", "Distance MBA"]} />
                </div>
                <Select name="budget" label="Budget" options={["Under ₹2L", "₹2L – ₹10L", "₹10L – ₹25L", "₹25L+"]} />
                <div>
                  <label className="text-xs font-semibold text-ink-2 block mb-1">Anything else? (optional)</label>
                  <Textarea name="message" rows={3} maxLength={1000} className="min-h-[88px]" />
                </div>
                <Button type="submit" disabled={loading} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {loading ? "Submitting…" : "Get my free shortlist"}
                </Button>
                <p className="text-[11px] text-ink-3 text-center">By submitting, you agree to our Terms & Privacy Policy.</p>
              </form>
            )}
          </div>
        </div>
      </section>
      <TestimonialsSection variant="counselling" />
    </SiteShell>
  );
}

function Field({ name, label, type = "text", required, placeholder }: any) {
  return (
    <div>
      <Label className="text-xs font-semibold text-ink-2 block mb-1">{label}{required && " *"}</Label>
      <Input name={name} type={type} required={required} placeholder={placeholder} className="h-10" />
    </div>
  );
}
function Select({ name, label, options }: any) {
  return (
    <div>
      <Label className="text-xs font-semibold text-ink-2 block mb-1">{label}</Label>
      <select name={name} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-card">
        <option value="">Select…</option>
        {options.map((o: string) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
