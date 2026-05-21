import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { CollegeCard, type College } from "@/components/site/CollegeCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Search, SlidersHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/colleges/")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => ({ q: (s.q as string) || undefined }),
  head: () => ({ meta: [{ title: "MBA Colleges in India — CampusUpdates" }, { name: "description", content: "Browse 500+ MBA colleges. Filter by fees, CAT cutoff, placements, hostel, scholarship and more." }] }),
  component: CollegesPage,
});

type ExtCollege = College & {
  cat_cutoff?: number | null;
  placement_pct?: number | null;
  hostel?: boolean | null;
  scholarship?: boolean | null;
  sponsored?: boolean | null;
};

function CollegesPage() {
  const { q = "" } = Route.useSearch();
  const nav = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState(q);
  const [type, setType] = useState<string>("all");
  const [budget, setBudget] = useState<string>("all");
  const [cat, setCat] = useState<string>("all");
  const [placement, setPlacement] = useState<string>("all");
  const [minPkg, setMinPkg] = useState<string>("all");
  const [hostel, setHostel] = useState(false);
  const [scholarship, setScholarship] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [colleges, setColleges] = useState<ExtCollege[] | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => { setSearch(q); }, [q]);

  useEffect(() => {
    supabase.from("colleges").select("*")
      .order("sponsored", { ascending: false })
      .order("featured", { ascending: false })
      .then(({ data }) => setColleges((data ?? []) as ExtCollege[]));
  }, []);

  useEffect(() => {
    if (!user) { setSavedIds(new Set()); return; }
    supabase.from("saved_colleges").select("college_id").eq("user_id", user.id)
      .then(({ data }) => setSavedIds(new Set((data ?? []).map((r) => r.college_id))));
  }, [user]);

  const filtered = useMemo(() => {
    if (!colleges) return [];
    return colleges.filter((c) => {
      if (search && !`${c.name} ${c.location} ${c.short_name || ""}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (type !== "all" && c.type !== type) return false;
      if (budget !== "all") {
        const max = c.fees_max ?? c.fees_min ?? 0;
        if (budget === "low" && max > 200000) return false;
        if (budget === "mid" && (max < 200000 || max > 1000000)) return false;
        if (budget === "high" && max < 1000000) return false;
      }
      if (cat !== "all") {
        const cc = Number(c.cat_cutoff || 0);
        if (cat === "99" && cc < 99) return false;
        if (cat === "90" && (cc < 90 || cc >= 99)) return false;
        if (cat === "80" && (cc < 80 || cc >= 90)) return false;
        if (cat === "any" && cc !== 0 && cc >= 80) return false;
      }
      if (placement !== "all") {
        const p = Number(c.placement_pct || 0);
        if (placement === "100" && p < 100) return false;
        if (placement === "90" && p < 90) return false;
        if (placement === "75" && p < 75) return false;
      }
      if (minPkg !== "all") {
        const avg = Number((c as any).placement_avg || 0);
        if (minPkg === "25" && avg < 2500000) return false;
        if (minPkg === "15" && avg < 1500000) return false;
        if (minPkg === "8" && avg < 800000) return false;
      }
      if (hostel && !c.hostel) return false;
      if (scholarship && !c.scholarship) return false;
      return true;
    });
  }, [colleges, search, type, budget, cat, placement, minPkg, hostel, scholarship]);

  const handleSave = async (id: string) => {
    if (!user) { toast.info("Sign in to save colleges"); nav({ to: "/auth" }); return; }
    if (savedIds.has(id)) {
      await supabase.from("saved_colleges").delete().eq("user_id", user.id).eq("college_id", id);
      setSavedIds((s) => { const n = new Set(s); n.delete(id); return n; });
      toast.success("Removed from saved");
    } else {
      await supabase.from("saved_colleges").insert({ user_id: user.id, college_id: id });
      setSavedIds((s) => new Set(s).add(id));
      toast.success("Saved");
    }
  };

  const types = colleges ? Array.from(new Set(colleges.map((c) => c.type).filter(Boolean))) as string[] : [];
  const selCls = "w-full px-3 py-2 border rounded-lg text-sm bg-card outline-none focus:border-primary";
  const reset = () => { setType("all"); setBudget("all"); setCat("all"); setPlacement("all"); setMinPkg("all"); setHostel(false); setScholarship(false); setSearch(""); };
  const activeCount = [type !== "all", budget !== "all", cat !== "all", placement !== "all", minPkg !== "all", hostel, scholarship].filter(Boolean).length;

  const Sidebar = (
    <aside className="bg-card rounded-2xl border p-5 space-y-5 lg:sticky lg:top-20 self-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h2 className="font-display font-bold text-sm">Filters</h2>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={reset} className="text-[11.5px] text-primary font-semibold hover:underline">Clear all</button>
        )}
      </div>

      <FilterBlock label="College type">
        <select value={type} onChange={(e) => setType(e.target.value)} className={selCls}>
          <option value="all">All types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </FilterBlock>

      <FilterBlock label="Budget (total fees)">
        <select value={budget} onChange={(e) => setBudget(e.target.value)} className={selCls}>
          <option value="all">Any budget</option>
          <option value="low">Under ₹2L</option>
          <option value="mid">₹2L – ₹10L</option>
          <option value="high">₹10L+</option>
        </select>
      </FilterBlock>

      <FilterBlock label="CAT cutoff">
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={selCls}>
          <option value="all">Any</option>
          <option value="99">99+ %ile</option>
          <option value="90">90–98 %ile</option>
          <option value="80">80–89 %ile</option>
          <option value="any">Under 80 / No CAT</option>
        </select>
      </FilterBlock>

      <FilterBlock label="Placement rate">
        <select value={placement} onChange={(e) => setPlacement(e.target.value)} className={selCls}>
          <option value="all">Any</option>
          <option value="100">100%</option>
          <option value="90">90%+</option>
          <option value="75">75%+</option>
        </select>
      </FilterBlock>

      <FilterBlock label="Average package">
        <select value={minPkg} onChange={(e) => setMinPkg(e.target.value)} className={selCls}>
          <option value="all">Any</option>
          <option value="25">₹25L+</option>
          <option value="15">₹15L+</option>
          <option value="8">₹8L+</option>
        </select>
      </FilterBlock>

      <FilterBlock label="Facilities">
        <label className="flex items-center gap-2 text-sm py-1">
          <input type="checkbox" checked={hostel} onChange={(e) => setHostel(e.target.checked)} className="w-4 h-4 accent-primary" />
          Hostel available
        </label>
        <label className="flex items-center gap-2 text-sm py-1">
          <input type="checkbox" checked={scholarship} onChange={(e) => setScholarship(e.target.checked)} className="w-4 h-4 accent-primary" />
          Scholarships
        </label>
      </FilterBlock>
    </aside>
  );

  return (
    <SiteShell>
      <div className="bg-gradient-to-br from-primary/8 via-card to-accent/8 border-b">
        <div className="max-w-[1240px] mx-auto px-6 py-10">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-2">MBA Colleges in India</h1>
          <p className="text-ink-3">Browse our verified catalogue of {colleges?.length ?? "…"} MBA programs · Filter, compare and apply.</p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Mobile filter toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium bg-card"
            >
              <SlidersHorizontal className="w-4 h-4" /> {showFilters ? "Hide filters" : "Show filters"}
              {activeCount > 0 && <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded-full px-1.5">{activeCount}</span>}
            </button>
            {showFilters && <div className="mt-3">{Sidebar}</div>}
          </div>
          <div className="hidden lg:block">{Sidebar}</div>

          <div>
            {/* Search bar */}
            <div className="bg-card rounded-2xl border p-3 mb-5 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
                <input
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search colleges, locations, programs…"
                  className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary bg-card"
                />
              </div>
              <div className="hidden md:block text-sm text-ink-3 px-2 whitespace-nowrap">
                {colleges ? <><b className="text-ink-1">{filtered.length}</b> of {colleges.length}</> : "…"}
              </div>
            </div>

            <div className="text-sm text-ink-3 mb-4 md:hidden">{colleges ? `${filtered.length} colleges found` : "Loading colleges…"}</div>
            {!colleges ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((c) => <CollegeCard key={c.id} c={c} onSave={handleSave} saved={savedIds.has(c.id)} />)}
                </div>
                {filtered.length === 0 && (
                  <div className="text-center py-20 bg-card border rounded-2xl">
                    <div className="text-4xl mb-3">🔍</div>
                    <div className="font-display font-bold text-ink-1 mb-1">No colleges match your filters</div>
                    <div className="text-sm text-ink-3 mb-4">Try clearing some filters to see more results.</div>
                    <button onClick={reset} className="text-sm font-semibold text-primary hover:underline">Clear all filters</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-bold text-ink-3 uppercase tracking-wider">{label}</div>
      {children}
    </div>
  );
}
