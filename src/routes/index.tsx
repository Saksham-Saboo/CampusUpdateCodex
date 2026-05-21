import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { CollegeCard, type College } from "@/components/site/CollegeCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SocialProofStrip } from "@/components/site/lead-gen/SocialProofStrip";
import { LeadMagnetsSection } from "@/components/site/lead-gen/LeadMagnetsSection";
import {
  ArrowRight, BadgeCheck, Calculator, GraduationCap, MessageCircle, Search,
  ShieldCheck, Sparkles, Star, TrendingUp, Users, Zap, CheckCircle2, Clock
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "CampusUpdates — Find Your Right MBA in Under 2 Minutes" },
    { name: "description", content: "Compare 1,200+ MBA colleges, get free expert counselling, and apply directly. India's #1 MBA discovery platform." },
  ]}),
  component: Home,
});

const QUIZ = [
  { key: "goal", q: "What's your main goal for the MBA?", opts: ["Career Switch", "Salary Hike", "Start Business", "Get Promoted"] },
  { key: "budget", q: "What's your budget for the full MBA?", opts: ["Under ₹5 Lakh", "₹5 – ₹15 Lakh", "₹15 – ₹30 Lakh", "₹30 Lakh+"] },
  { key: "mode", q: "Preferred mode of study?", opts: ["Full Time", "Part Time", "Executive", "Online"] },
  { key: "spec", q: "Preferred specialization?", opts: ["Finance", "Marketing", "HR", "Data Analytics"] },
];

const REVIEWS = [
  { name: "Aditya Sharma", detail: "MBA Finance · IIBM, Patna", text: "I had no idea about MBA options after BCom. CampusUpdates' counsellor walked me through 5 colleges in 30 mins. Got direct admission in 2 weeks.", av: "AS", bg: "#1043E9" },
  { name: "Priya Mehta", detail: "MBA Marketing · Symbiosis, Pune", text: "I compared 8 colleges here and the ROI calculator was a game-changer. Realized Symbiosis was worth the higher fees. My counsellor Neha was amazing.", av: "PM", bg: "#7C3AED" },
  { name: "Rahul Verma", detail: "Executive MBA · LBSIM Delhi", text: "As a working professional I needed flexible admission. The team found me an executive MBA with weekend classes. Process was smooth and fast.", av: "RV", bg: "#DC2626" },
  { name: "Sneha Joshi", detail: "MBA HR · Christ University, Bangalore", text: "The admission probability indicator was spot on. I applied to 3 colleges with 70%+ match and got into 2 of them. Really useful feature.", av: "SJ", bg: "#059669" },
];

function Home() {
  const [featured, setFeatured] = useState<College[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    supabase.from("colleges").select("*").order("featured", { ascending: false }).limit(6)
      .then(({ data }) => setFeatured((data ?? []) as College[]));
    supabase.from("news_items").select("*").eq("status", "published").order("published_date", { ascending: false }).limit(3)
      .then(({ data }) => setNews(data ?? []));
  }, []);

  // Quiz state
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = step >= QUIZ.length;
  const progress = done ? 100 : (step / QUIZ.length) * 100;

  function pick(opt: string) {
    const cur = QUIZ[step];
    setAnswers((a) => ({ ...a, [cur.key]: opt }));
    setTimeout(() => setStep((s) => s + 1), 280);
  }

  // ROI
  const [cur, setCur] = useState(6);
  const [post, setPost] = useState(14);
  const [fees, setFees] = useState(8);
  const [dur, setDur] = useState(2);
  const roi = useMemo(() => {
    const hike = post - cur;
    const payback = hike > 0 ? Math.round((fees / hike) * 12) : 999;
    const fiveYr = hike * 5 - fees - cur * dur;
    const mult = cur > 0 ? (post / cur).toFixed(1) : "—";
    return { hike, payback, fiveYr, mult };
  }, [cur, post, fees, dur]);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="gradient-hero relative overflow-hidden pt-16 pb-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_0%,rgba(99,179,255,0.14),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <div className="max-w-[1180px] mx-auto grid lg:grid-cols-[1fr_440px] gap-14 items-center relative">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 px-3.5 py-1.5 rounded-full text-xs font-semibold font-display mb-5">
              <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
              India's #1 MBA-Only Discovery Platform
            </span>
            <h1 className="font-display text-[2.6rem] md:text-[2.9rem] font-extrabold text-white leading-[1.12] mb-4 tracking-[-0.02em]">
              Find Your <span className="text-[#93C5FD]">Right MBA</span><br />
              in Under <span className="text-gradient-warm">2 Minutes</span>
            </h1>
            <p className="text-white/70 text-[1.05rem] mb-8 max-w-[500px] leading-[1.65]">
              Stop wasting months on wrong colleges. Answer 4 quick questions and get your personalized MBA shortlist — free expert call included.
            </p>
            <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.28)] max-w-[580px] mb-5">
              <select className="px-3.5 py-2.5 border-[1.5px] border-border rounded-xl text-[13px] bg-muted outline-none min-w-[130px]">
                <option>All Courses</option><option>MBA Full Time</option><option>PGDM</option><option>Executive MBA</option><option>Online MBA</option>
              </select>
              <input
                placeholder="College, city or specialization..."
                className="flex-1 px-4 py-2.5 border-[1.5px] border-border rounded-xl text-sm outline-none focus:border-primary min-w-0"
                onKeyDown={(e) => { if (e.key === "Enter") nav({ to: "/colleges", search: { q: (e.target as HTMLInputElement).value } as never }); }}
              />
              <Button size="lg" onClick={() => nav({ to: "/colleges", search: { q: "" } as never })} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5 shrink-0">
                Search <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Delhi NCR", "Mumbai", "Bangalore", "Online MBA", "Fees < ₹5L", "Direct Admission"].map((c) => (
                <button key={c} onClick={() => nav({ to: "/colleges", search: { q: c } as never })}
                  className="bg-white/10 border border-white/20 text-white/85 hover:bg-white/20 hover:text-white px-3.5 py-1.5 rounded-full text-xs transition">
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* QUIZ CARD */}
          <div className="bg-card rounded-3xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
            <h3 className="font-display text-base font-bold mb-1">🎯 Find My Perfect MBA</h3>
            <p className="text-[12.5px] text-ink-3 mb-5">4 questions · 90 seconds · Free personalized shortlist</p>
            <div className="h-1 bg-border rounded-full mb-5 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            {!done ? (
              <>
                <div className="text-sm font-semibold mb-3">{QUIZ[step].q}</div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {QUIZ[step].opts.map((opt) => (
                    <button key={opt} onClick={() => pick(opt)}
                      className={`border-[1.5px] border-border rounded-lg px-3 py-2.5 text-[13px] font-medium text-ink-2 hover:border-primary hover:bg-primary-soft hover:text-primary transition text-center ${
                        answers[QUIZ[step].key] === opt ? "border-primary bg-primary-soft text-primary font-semibold" : ""
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-xs text-ink-3">Step {step + 1} of {QUIZ.length}</span>
                  {step > 0 && <button onClick={() => setStep(s => s - 1)} className="text-xs text-ink-3 hover:text-primary">← Back</button>}
                </div>
              </>
            ) : (
              <>
                <div className="text-[13px] font-semibold text-ink-3 mb-3">Your top matches — based on your profile:</div>
                {[
                  { code: "AM", name: "Amity Business School", tag: "Direct Admission Available", pct: 92, bg: "#1043E9" },
                  { code: "CH", name: "Christ University, Bangalore", tag: "Strong Placements", pct: 88, bg: "#059669" },
                  { code: "SY", name: "Symbiosis Institute, Pune", tag: "Top Ranked", pct: 81, bg: "#7C3AED" },
                ].map((m) => (
                  <div key={m.code} onClick={() => nav({ to: "/colleges", search: { q: "" } as never })}
                    className="border-[1.5px] border-border rounded-lg px-3.5 py-3 flex items-center gap-3 mb-2 cursor-pointer hover:border-primary hover:shadow-card transition">
                    <div className="w-[38px] h-[38px] rounded-lg flex items-center justify-center font-display font-bold text-[0.85rem] text-white shrink-0" style={{ background: m.bg }}>{m.code}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate">{m.name}</div>
                      <div className="text-[11.5px] text-success font-medium">✓ {m.tag}</div>
                    </div>
                    <div className="font-display font-bold text-base text-primary">{m.pct}%</div>
                  </div>
                ))}
                <Link to="/counselling" className="block">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-2 gap-1.5">
                    Talk to Counsellor — Free <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 pt-3.5 mt-3.5 border-t">
                  <div className="flex -space-x-2">
                    {["#1043E9", "#059669", "#7C3AED"].map((bg, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white" style={{ background: bg }}>
                        {["PS", "AK", "RM"][i]}
                      </div>
                    ))}
                  </div>
                  <span className="text-[11.5px] text-ink-3">3 counsellors available now</span>
                  <span className="ml-auto text-[11px] text-success font-semibold">● Online</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* LIVE SOCIAL PROOF TICKER */}
      <SocialProofStrip />

      {/* PROOF STRIP */}
      <section className="bg-gradient-to-br from-card via-primary-soft/30 to-card border-y relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,67,233,0.08),transparent_50%),radial-gradient(circle_at_80%_50%,rgba(240,90,38,0.06),transparent_50%)] pointer-events-none" />
        <div className="max-w-[1180px] mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-5 gap-3 relative">
          {[
            { i: <GraduationCap className="w-5 h-5" />, c: "bg-primary-soft text-primary", ring: "group-hover:shadow-[0_8px_24px_-6px_rgba(16,67,233,0.45)]", n: "1,200+", l: "MBA Colleges Listed" },
            { i: <Users className="w-5 h-5" />, c: "bg-success-soft text-success", ring: "group-hover:shadow-[0_8px_24px_-6px_rgba(5,150,105,0.45)]", n: "50,000+", l: "Students Counselled" },
            { i: <Zap className="w-5 h-5" />, c: "bg-accent-soft text-accent", ring: "group-hover:shadow-[0_8px_24px_-6px_rgba(240,90,38,0.45)]", n: "150+", l: "Direct Admission Partners" },
            { i: <BadgeCheck className="w-5 h-5" />, c: "bg-[#F5F3FF] text-[#7C3AED]", ring: "group-hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)]", n: "98%", l: "Admission Success Rate" },
            { i: <Star className="w-5 h-5" />, c: "bg-[#FFFBEB] text-warning", ring: "group-hover:shadow-[0_8px_24px_-6px_rgba(245,158,11,0.5)]", n: "4.8 / 5", l: "Student Rating (12K+)" },
          ].map((p, idx) => (
            <div
              key={p.l}
              className="group relative flex items-center gap-3 p-3 rounded-2xl bg-card/60 backdrop-blur-sm border border-transparent hover:border-primary/15 hover:bg-card hover:-translate-y-1 hover:shadow-pop transition-all duration-300 cursor-default"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${p.c} ${p.ring} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                {p.i}
              </div>
              <div className="min-w-0">
                <div className="font-display font-extrabold text-[1.45rem] leading-tight bg-gradient-to-r from-ink to-ink-2 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-300">
                  {p.n}
                </div>
                <div className="text-[11.5px] text-ink-3 group-hover:text-ink-2 transition-colors">{p.l}</div>
              </div>
              <div className="absolute inset-x-3 bottom-1 h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="max-w-[1180px] mx-auto px-6 pt-13">
        <div className="bg-gradient-to-br from-[#F5F3FF] to-primary-soft dark:from-[#111827] dark:via-[#121A2C] dark:to-[#172554] border border-primary/10 dark:border-white/10 rounded-3xl p-8 md:p-10 grid md:grid-cols-2 gap-10 items-center dark:shadow-[0_24px_70px_rgba(0,0,0,0.36)]">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-primary/10 dark:bg-primary/15 text-primary text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
              <Calculator className="w-3 h-3" /> ROI CALCULATOR
            </span>
            <h2 className="font-display text-2xl font-bold mb-2">💰 MBA ROI Calculator</h2>
            <p className="text-sm text-ink-2 mb-5">See exactly how much your MBA will earn back — most students recover fees within 18 months. Don't pick a college blind.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-ink-2 block mb-1.5">Current Salary (LPA)</label>
                <input type="number" value={cur} onChange={(e) => setCur(+e.target.value)} className="w-full px-3 py-2.5 bg-card text-foreground border rounded-lg text-sm outline-none focus:border-primary dark:border-white/15 dark:bg-white/5 dark:focus:bg-card" />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-2 block mb-1.5">Expected Post-MBA (LPA)</label>
                <input type="number" value={post} onChange={(e) => setPost(+e.target.value)} className="w-full px-3 py-2.5 bg-card text-foreground border rounded-lg text-sm outline-none focus:border-primary dark:border-white/15 dark:bg-white/5 dark:focus:bg-card" />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-2 block mb-1.5">Total MBA Fees (₹ Lakh)</label>
                <input type="number" value={fees} onChange={(e) => setFees(+e.target.value)} className="w-full px-3 py-2.5 bg-card text-foreground border rounded-lg text-sm outline-none focus:border-primary dark:border-white/15 dark:bg-white/5 dark:focus:bg-card" />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-2 block mb-1.5">Program Duration</label>
                <select value={dur} onChange={(e) => setDur(+e.target.value)} className="w-full px-3 py-2.5 bg-card text-foreground border rounded-lg text-sm outline-none focus:border-primary dark:border-white/15 dark:bg-white/5 dark:focus:bg-card">
                  <option value={2}>2 Years</option><option value={1}>1 Year</option><option value={1.5}>18 Months</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-card dark:border dark:border-white/10 dark:shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
            <div className="font-display font-bold text-[0.97rem] mb-4">Your MBA ROI Summary</div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-primary-soft dark:bg-primary/15 rounded-xl p-4 text-center">
                <div className="font-display text-2xl font-extrabold text-primary">+₹{Math.max(0, roi.hike)}L</div>
                <div className="text-[11px] text-ink-3 mt-1">Annual Hike</div>
              </div>
              <div className="bg-success-soft dark:bg-success/15 rounded-xl p-4 text-center">
                <div className="font-display text-2xl font-extrabold text-success">{roi.payback < 999 ? `${roi.payback} mo` : "—"}</div>
                <div className="text-[11px] text-ink-3 mt-1">Payback Period</div>
              </div>
              <div className="bg-accent-soft dark:bg-accent/15 rounded-xl p-4 text-center">
                <div className="font-display text-2xl font-extrabold text-accent">{roi.mult}×</div>
                <div className="text-[11px] text-ink-3 mt-1">Salary Multiplier</div>
              </div>
              <div className="bg-muted dark:bg-white/5 rounded-xl p-4 text-center">
                <div className="font-display text-2xl font-extrabold">₹{roi.fiveYr}L</div>
                <div className="text-[11px] text-ink-3 mt-1">5-yr Net Gain</div>
              </div>
            </div>
            <Link to="/colleges" search={{ q: "" } as never}>
              <Button size="lg" className="w-full bg-primary gap-1.5">
                See colleges in your budget <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED COLLEGES */}
      <section className="max-w-[1180px] mx-auto px-6 py-13">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="font-display text-2xl font-bold">Top <span className="text-primary">MBA Colleges</span> right now</h2>
            <p className="text-sm text-ink-3 mt-1">Hand-picked colleges with admissions opening soon</p>
          </div>
          <Link to="/colleges" search={{ q: "" } as never} className="text-sm text-primary font-semibold hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((c) => <CollegeCard key={c.id} c={c} />)}
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-card border-y py-14">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold">Why 50,000+ aspirants trust CampusUpdates</h2>
            <p className="text-sm text-ink-3 mt-2 max-w-md mx-auto">No bias. No spam. Just real data and verified counsellors.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { i: BadgeCheck, c: "bg-primary-soft text-primary", t: "Verified Data", d: "Every college fact, fee, and ranking verified by our team." },
              { i: Sparkles, c: "bg-accent-soft text-accent", t: "AI-Matched Picks", d: "Get a shortlist tailored to your profile, budget & goals." },
              { i: TrendingUp, c: "bg-success-soft text-success", t: "Real ROI Data", d: "Placement & salary data from 50,000+ alumni." },
              { i: MessageCircle, c: "bg-[#F5F3FF] text-[#7C3AED]", t: "Free Counselling", d: "Chat with industry-trained counsellors. Zero fee." },
            ].map(({ i: I, c, t, d }) => (
              <div key={t} className="text-center p-6">
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${c}`}>
                  <I className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-base mb-1.5">{t}</h3>
                <p className="text-sm text-ink-3 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="max-w-[1180px] mx-auto px-6 py-13">
        <div className="mb-7">
          <h2 className="font-display text-2xl font-bold">Real stories. <span className="text-primary">Real admissions.</span></h2>
          <p className="text-sm text-ink-3 mt-1">Verified reviews from students admitted in 2024</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin">
          {REVIEWS.map((r) => (
            <div key={r.name} className="bg-card border rounded-2xl p-5 min-w-[300px] max-w-[300px] snap-start shrink-0 hover:shadow-card transition">
              <div className="flex gap-0.5 mb-2.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />)}
              </div>
              <p className="text-[13.5px] text-ink-2 leading-[1.65] mb-3.5">"{r.text}"</p>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-[0.85rem] text-white shrink-0" style={{ background: r.bg }}>{r.av}</div>
                <div>
                  <div className="text-[13px] font-semibold">{r.name}</div>
                  <div className="text-xs text-ink-3">{r.detail}</div>
                  <div className="inline-block bg-success-soft text-success text-[10.5px] font-semibold px-2 py-0.5 rounded mt-0.5">✓ Verified Admission</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWS WIDGET */}
      {news.length > 0 && (
        <section className="bg-muted/40 border-y">
          <div className="max-w-[1180px] mx-auto px-6 py-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold">Latest News & Updates</h2>
                <p className="text-sm text-ink-3 mt-1">Admission alerts, policy changes, exam updates</p>
              </div>
              <Link to="/news" className="text-sm text-primary font-semibold hover:underline">View All News →</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {news.map((n) => {
                const inner = (
                  <article className="bg-card border-l-4 border border-l-primary rounded-xl p-5 h-full hover:shadow-pop transition cursor-pointer">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-primary">{n.category}</span>
                    <h3 className="font-display font-bold text-[15px] mt-2 mb-2 leading-snug line-clamp-2">{n.title}</h3>
                    <div className="flex items-center justify-between text-xs text-ink-3 mt-3 pt-3 border-t">
                      <span>{new Date(n.published_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      <span className="text-primary font-semibold flex items-center gap-1">Read More <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </article>
                );
                return n.source_url
                  ? <a key={n.id} href={n.source_url} target="_blank" rel="noopener noreferrer">{inner}</a>
                  : <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }}>{inner}</Link>;
              })}
            </div>
          </div>
        </section>
      )}

      {/* LEAD MAGNETS */}
      <LeadMagnetsSection />

      <section className="gradient-cta text-white py-3.5 px-6">
        <div className="max-w-[1180px] mx-auto flex items-center justify-center gap-3.5 text-[13.5px] flex-wrap">
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">⚡ Limited</span>
          <span>Only <span className="font-display font-bold text-[1.05rem] text-warning">34</span> direct admission slots left for July 2025</span>
          <Clock className="w-4 h-4" />
          <Link to="/counselling" className="underline font-semibold hover:text-warning">Book free call →</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1180px] mx-auto px-6 py-14">
        <div className="bg-gradient-to-br from-primary to-primary-deep rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-warning" />
            <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-3">Ready to find your right MBA?</h2>
            <p className="text-white/80 mb-7 max-w-xl mx-auto">
              Get a free, personalised college shortlist in 24 hours. No fees. No spam. Just expert advice.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/counselling"><Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
                Get Free Counselling <ArrowRight className="w-4 h-4" />
              </Button></Link>
              <Link to="/colleges" search={{ q: "" } as never}><Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10">Browse Colleges</Button></Link>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-white/70">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% free · No spam · Reply in 24 hours
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
