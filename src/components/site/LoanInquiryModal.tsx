import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  collegeName?: string;
}

export function LoanInquiryModal({ open, onOpenChange, collegeName }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    full_name: "", mobile: "", email: "", city: "",
    qualification: "", preferred_college: collegeName || "",
    loan_amount: "", preferred_bank: "Any",
  });

  useEffect(() => {
    if (open) {
      setDone(false);
      setForm((f) => ({ ...f, preferred_college: collegeName || f.preferred_college }));
    }
  }, [open, collegeName]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.mobile || !form.email) {
      toast.error("Please fill name, mobile and email");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("loan_leads").insert(form);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setDone(true);
  };

  const cls = "w-full h-10 px-3 border rounded-lg text-sm outline-none focus:border-primary bg-card";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Loan Eligibility Inquiry</DialogTitle>
        </DialogHeader>
        {done ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-success-soft rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">Thank you!</h3>
            <p className="text-sm text-ink-3">Our loan expert will call you within 24 hours.</p>
            <Button className="mt-5" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3 text-sm">
            <div>
              <label className="text-xs font-semibold mb-1 block">Full Name *</label>
              <input required value={form.full_name} onChange={(e) => set("full_name", e.target.value)} className={cls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block">Mobile *</label>
                <input required type="tel" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} className={cls} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">Email *</label>
                <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={cls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block">City</label>
                <input value={form.city} onChange={(e) => set("city", e.target.value)} className={cls} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">Highest Qualification</label>
                <select value={form.qualification} onChange={(e) => set("qualification", e.target.value)} className={cls}>
                  <option value="">Select…</option>
                  <option>Graduate</option>
                  <option>Post Graduate</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Preferred College</label>
              <input value={form.preferred_college} onChange={(e) => set("preferred_college", e.target.value)} className={cls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block">Loan Amount Required</label>
                <select value={form.loan_amount} onChange={(e) => set("loan_amount", e.target.value)} className={cls}>
                  <option value="">Select…</option>
                  <option>Under ₹5L</option>
                  <option>₹5L–₹10L</option>
                  <option>₹10L–₹20L</option>
                  <option>₹20L+</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">Preferred Bank</label>
                <select value={form.preferred_bank} onChange={(e) => set("preferred_bank", e.target.value)} className={cls}>
                  {["Any", "SBI", "HDFC", "ICICI", "Axis", "PNB", "Bank of Baroda"].map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <Button type="submit" disabled={loading} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-2">
              {loading ? "Submitting…" : "Submit Loan Inquiry"}
            </Button>
            <p className="text-[11px] text-ink-3 text-center">No processing fee. We'll never share your data.</p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
