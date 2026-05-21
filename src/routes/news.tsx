import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Calendar, ExternalLink, Newspaper } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [
    { title: "MBA & Education News — CampusUpdates" },
    { name: "description", content: "Latest admission alerts, policy updates, college news, exam updates and scholarships." },
  ]}),
  component: NewsPage,
});

const CATEGORIES = ["All", "Admission Alerts", "Policy Updates", "College News", "Exam Updates", "Scholarships"];

const CAT_COLOR: Record<string, string> = {
  "Admission Alerts": "border-l-accent bg-accent-soft/30",
  "Policy Updates": "border-l-primary bg-primary-soft/30",
  "College News": "border-l-success bg-success-soft/30",
  "Exam Updates": "border-l-purple-600 bg-purple-50",
  "Scholarships": "border-l-warning bg-yellow-50",
};

function NewsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    supabase.from("news_items").select("*").eq("status", "published").order("published_date", { ascending: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  const filtered = useMemo(() => filter === "All" ? items : items.filter((n) => n.category === filter), [items, filter]);

  return (
    <SiteShell>
      <div className="bg-card border-b">
        <div className="max-w-[1180px] mx-auto px-6 py-10">
          <h1 className="font-display text-3xl font-extrabold mb-2">MBA & Education News</h1>
          <p className="text-ink-3">Stay updated with the latest from top colleges, admission alerts and education policy.</p>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-6 py-8">
        <div className="flex gap-2 flex-wrap mb-7">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition ${
                filter === c ? "bg-primary text-primary-foreground border-primary" : "bg-card text-ink-2 border-border hover:border-primary hover:text-primary"
              }`}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-44 bg-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-12 h-12 text-ink-3 mx-auto mb-3" />
            <p className="text-ink-3">No news articles yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((n) => {
              const isExternal = !!n.source_url;
              const inner = (
                <article className={`bg-card border border-l-4 ${CAT_COLOR[n.category] || "border-l-primary"} rounded-xl p-5 h-full hover:shadow-pop transition cursor-pointer`}>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-primary">{n.category}</span>
                  <h3 className="font-display font-bold text-base mt-2 mb-2 leading-snug">{n.title}</h3>
                  {n.excerpt && <p className="text-sm text-ink-3 line-clamp-2 mb-3">{n.excerpt}</p>}
                  <div className="flex items-center justify-between text-xs text-ink-3 mt-3 pt-3 border-t">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(n.published_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span className="text-primary font-semibold flex items-center gap-1">
                      Read More {isExternal ? <ExternalLink className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                    </span>
                  </div>
                </article>
              );
              return isExternal
                ? <a key={n.id} href={n.source_url} target="_blank" rel="noopener noreferrer">{inner}</a>
                : <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }}>{inner}</Link>;
            })}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
