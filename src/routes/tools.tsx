import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  Calculator, GraduationCap, FileEdit, Banknote, TrendingUp,
  Scale, FileSpreadsheet, Sparkles, Lock, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Free MBA Tools — Calculators, AI Reviewers & More | CampusUpdates" },
      { name: "description", content: "All-in-one MBA toolkit: EMI calculator, ROI calculator, college recommender, SOP reviewer, loan eligibility, college compare and more. Free for members." },
    ],
  }),
  component: ToolsHub,
});

type Tool = {
  to: string;
  title: string;
  desc: string;
  icon: any;
  badge?: string;
  color: string; // tailwind bg
  requiresLogin?: boolean;
  external?: boolean;
};

const tools: Tool[] = [
  { to: "/ai-tools", title: "College Recommender (AI)", desc: "Personalised MBA shortlist matched to your score, budget and goals.", icon: GraduationCap, badge: "AI", color: "from-primary/15 to-primary/5", requiresLogin: true },
  { to: "/ai-tools", title: "Essay / SOP Reviewer (AI)", desc: "Instant feedback on your statement of purpose and admission essays.", icon: FileEdit, badge: "AI", color: "from-accent/15 to-accent/5", requiresLogin: true },
  { to: "/ai-tools", title: "Loan Eligibility Predictor (AI)", desc: "Find out how much loan you qualify for — and from which banks.", icon: Banknote, badge: "AI", color: "from-success/15 to-success/5", requiresLogin: true },
  { to: "/loan", title: "EMI Calculator", desc: "Estimate your monthly loan repayment for any amount, rate and tenure.", icon: Calculator, color: "from-primary/15 to-primary/5", requiresLogin: true },
  { to: "/loan/#roi", title: "MBA ROI Calculator", desc: "Compare salary uplift vs fees & living costs — break-even years.", icon: TrendingUp, color: "from-warning/15 to-warning/5", requiresLogin: true, external: true },
  { to: "/compare", title: "Compare Colleges", desc: "Side-by-side comparison: fees, placements, cutoffs, charts.", icon: Scale, color: "from-accent/15 to-accent/5", requiresLogin: true },
  { to: "/lead-magnets/MBA-ROI-Calculator.xlsx", title: "ROI Calculator (Excel)", desc: "Downloadable Excel sheet — model your own MBA scenarios offline.", icon: FileSpreadsheet, color: "from-success/15 to-success/5", external: true },
  { to: "/lead-magnets/Top-50-MBA-Colleges-2026.pdf", title: "Top 50 MBA Colleges 2026 (PDF)", desc: "Free curated PDF with rankings, fees and placement stats.", icon: FileSpreadsheet, color: "from-primary/15 to-primary/5", external: true },
];

function ToolsHub() {
  const { user } = useAuth();
  const nav = useNavigate();

  const handleClick = (t: Tool, e: React.MouseEvent) => {
    if (t.requiresLogin && !user) {
      e.preventDefault();
      nav({ to: "/auth", search: { redirect: t.to } as any });
    }
  };

  return (
    <SiteShell>
      <div className="bg-gradient-to-br from-primary/8 via-card to-accent/8 border-b">
        <div className="max-w-[1180px] mx-auto px-6 py-14">
          <span className="inline-flex items-center gap-1.5 bg-primary-soft text-primary text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> All tools in one place
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold">Free MBA tools & calculators</h1>
          <p className="text-ink-3 mt-2 max-w-2xl">From AI shortlists to EMI calculators — everything you need to plan your MBA, in one place.</p>
          {!user && (
            <div className="mt-5 inline-flex items-center gap-2 bg-card border rounded-lg px-3.5 py-2 text-[13px]">
              <Lock className="w-3.5 h-3.5 text-ink-3" />
              <span className="text-ink-2">Sign in once to unlock all tools — free forever.</span>
              <Link to="/auth"><Button size="sm" variant="outline" className="ml-1 h-7">Sign in</Button></Link>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((t) => {
            const Icon = t.icon;
            const locked = t.requiresLogin && !user;
            const inner = (
              <div
                onClick={(e) => handleClick(t, e)}
                className={`group bg-gradient-to-br ${t.color} bg-card border rounded-2xl p-6 hover:border-primary/40 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all cursor-pointer h-full flex flex-col`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-card border flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {t.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground uppercase tracking-wider">{t.badge}</span>
                    )}
                    {locked && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-ink-3 uppercase tracking-wider inline-flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Login
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-display font-bold text-[15.5px] text-ink-1 mb-1.5 leading-snug">{t.title}</h3>
                <p className="text-[13px] text-ink-3 leading-relaxed flex-1">{t.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary group-hover:gap-2 transition-all">
                  Open tool <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
            if (t.external) {
              return (
                <a key={t.title} href={t.to} target={t.to.startsWith("/lead-magnets/") ? "_blank" : undefined} rel="noopener">
                  {inner}
                </a>
              );
            }
            return (
              <Link key={t.title} to={t.to as any} className="block">
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}
