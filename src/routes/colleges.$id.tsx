import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { ArrowLeft, Star, MapPin, Award, Clock, IndianRupee, CheckCircle2, Heart, Banknote } from "lucide-react";
import { LoanInquiryModal } from "@/components/site/LoanInquiryModal";
import { ExitIntentBrochurePopup } from "@/components/site/lead-gen/ExitIntentBrochurePopup";
import { SimilarColleges } from "@/components/site/SimilarColleges";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/colleges/$id")({
  component: CollegeDetail,
});

function CollegeDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [c, setC] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);

  useEffect(() => {
    supabase.from("colleges").select("*").eq("id", id).maybeSingle().then(({ data }) => setC(data));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    supabase.from("saved_colleges").select("id").eq("user_id", user.id).eq("college_id", id).maybeSingle()
      .then(({ data }) => setSaved(!!data));
    supabase.from("applications").select("id").eq("user_id", user.id).eq("college_id", id).maybeSingle()
      .then(({ data }) => setApplied(!!data));
  }, [user, id]);

  if (!c) return (
    <SiteShell>
      <div className="max-w-[1180px] mx-auto px-6 py-10 space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">{[0,1,2,3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      </div>
    </SiteShell>
  );

  const initials = (c.short_name || c.name).slice(0, 3).toUpperCase();

  const apply = async () => {
    if (!user) { toast.info("Sign in to apply"); nav({ to: "/auth" }); return; }
    const { error } = await supabase.from("applications").insert({ user_id: user.id, college_id: c.id });
    if (error) { toast.error(error.message); return; }
    setApplied(true);
    toast.success("Application started! Continue on the college portal.");
    if (c.apply_link) window.open(c.apply_link, "_blank");
  };

  const save = async () => {
    if (!user) { toast.info("Sign in to save"); nav({ to: "/auth" }); return; }
    if (saved) {
      await supabase.from("saved_colleges").delete().eq("user_id", user.id).eq("college_id", c.id);
      setSaved(false);
    } else {
      await supabase.from("saved_colleges").insert({ user_id: user.id, college_id: c.id });
      setSaved(true);
    }
  };

  const fmt = (n: number | null) => (n ? `₹${(n / 100000).toFixed(2)}L` : "—");

  return (
    <SiteShell>
      <div className="bg-card border-b">
        <div className="max-w-[1180px] mx-auto px-6 py-8">
          <Link to="/colleges" search={{ q: "" } as never} className="inline-flex items-center gap-1 text-sm text-ink-3 hover:text-primary mb-5">
            <ArrowLeft className="w-4 h-4" /> All colleges
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display text-xl font-extrabold text-white shrink-0"
              style={{ background: c.logo_color || "#1043E9" }}>{initials}</div>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-extrabold mb-2">{c.name}</h1>
              <div className="flex items-center gap-4 text-sm text-ink-3 flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {c.location}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-warning text-warning" /> {c.rating?.toFixed(1)}</span>
                {c.type && <span className="bg-primary-soft text-primary px-2 py-0.5 rounded">{c.type}</span>}
                {c.admission_open && <span className="bg-success-soft text-success px-2 py-0.5 rounded font-semibold">Admission Open</span>}
                {c.sponsored && <span className="bg-gradient-to-r from-warning to-accent text-white px-2 py-0.5 rounded font-bold">★ Sponsored</span>}
              </div>
            </div>
            <div className="flex flex-col gap-2 hidden md:flex">
              <Button onClick={apply} disabled={applied} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {applied ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Applied</> : "Apply Now"}
              </Button>
              <Button variant="outline" size="sm" onClick={save}>
                <Heart className={`w-4 h-4 mr-2 ${saved ? "fill-accent text-accent" : ""}`} />
                {saved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-6 py-10 grid md:grid-cols-[1fr_320px] gap-8">
        <div>
          <section className="bg-card border rounded-2xl p-6 mb-6">
            <h2 className="font-display text-lg font-bold mb-3">About the program</h2>
            <p className="text-ink-2 leading-relaxed">{c.description || "Detailed program information coming soon."}</p>
          </section>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { i: IndianRupee, l: "Total Fees", v: `${fmt(c.fees_min)}${c.fees_max && c.fees_max !== c.fees_min ? ` – ${fmt(c.fees_max)}` : ""}` },
              { i: Clock, l: "Duration", v: c.duration || "—" },
              { i: Award, l: "Avg Placement", v: fmt(c.placement_avg) },
              { i: Star, l: "Highest Package", v: fmt(c.placement_high) },
            ].map(({ i: I, l, v }) => (
              <div key={l} className="bg-card border rounded-xl p-5">
                <div className="flex items-center gap-2 text-ink-3 text-xs mb-1.5"><I className="w-4 h-4" /> {l}</div>
                <div className="font-display text-xl font-bold">{v}</div>
              </div>
            ))}
          </div>

          {c.accreditations?.length > 0 && (
            <section className="bg-card border rounded-2xl p-6 mb-6">
              <h2 className="font-display text-lg font-bold mb-3">Accreditations</h2>
              <div className="flex gap-2 flex-wrap">
                {c.accreditations.map((a: string) => (
                  <span key={a} className="bg-primary-soft text-primary text-sm font-semibold px-3 py-1.5 rounded-lg">{a}</span>
                ))}
              </div>
            </section>
          )}

          <SimilarColleges college={c} />
        </div>

        <aside>
          <div className="bg-card border rounded-2xl p-6 sticky top-20">
            <div className="text-xs text-ink-3 mb-1">Total Fees</div>
            <div className="font-display text-2xl font-extrabold mb-4">
              {fmt(c.fees_min)}{c.fees_max && c.fees_max !== c.fees_min ? ` – ${fmt(c.fees_max)}` : ""}
            </div>
            <Button onClick={apply} disabled={applied} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mb-2">
              {applied ? "Application Started" : "Apply Now"}
            </Button>
            <Button variant="outline" size="lg" onClick={() => setLoanOpen(true)} className="w-full mb-2 border-primary/30 text-primary hover:bg-primary-soft">
              <Banknote className="w-4 h-4 mr-2" /> Apply for Loan
            </Button>
            <Button variant="outline" size="lg" onClick={save} className="w-full mb-2">
              <Heart className={`w-4 h-4 mr-2 ${saved ? "fill-accent text-accent" : ""}`} /> {saved ? "Saved" : "Save college"}
            </Button>
            <Link to="/counselling"><Button variant="ghost" size="sm" className="w-full">Talk to a counsellor →</Button></Link>
          </div>
        </aside>
      </div>
      <LoanInquiryModal open={loanOpen} onOpenChange={setLoanOpen} collegeName={c.name} />
      <ExitIntentBrochurePopup collegeId={c.id} collegeName={c.name} />
    </SiteShell>
  );
}
