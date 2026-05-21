import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Calendar, BookOpen } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [{ title: "MBA Insights & Guides — CampusUpdates" }] }),
  component: Blog,
});

const CATEGORIES = ["All", "Admissions", "College Reviews", "Career Guidance", "Entrance Exams", "Scholarships", "Rankings", "Tips"];

function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    supabase.from("blog_posts").select("*").eq("status", "published").order("published_date", { ascending: false })
      .then(({ data }) => { setPosts(data ?? []); setLoading(false); });
  }, []);

  const filtered = useMemo(() => filter === "All" ? posts : posts.filter((p) => p.category === filter), [posts, filter]);

  return (
    <SiteShell>
      <div className="bg-card border-b">
        <div className="max-w-[1180px] mx-auto px-6 py-10">
          <h1 className="font-display text-3xl font-extrabold mb-2">MBA Insights & Guides</h1>
          <p className="text-ink-3">Real stories, rankings, and admissions advice from our team</p>
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
          <div className="grid md:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-ink-3 mx-auto mb-3" />
            <p className="text-ink-3">No blog posts yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }}>
                <article className="bg-card border rounded-2xl overflow-hidden hover:shadow-pop transition cursor-pointer h-full">
                  {p.cover_image_url
                    ? <img src={p.cover_image_url} alt={p.title} className="w-full h-44 object-cover" />
                    : <div className="h-44 gradient-cta opacity-90" />}
                  <div className="p-5">
                    <span className="text-xs font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded">{p.category}</span>
                    <h3 className="font-display font-bold text-base mt-3 mb-2 leading-snug line-clamp-2">{p.title}</h3>
                    {p.excerpt && <p className="text-sm text-ink-3 line-clamp-2">{p.excerpt}</p>}
                    <div className="flex items-center justify-between text-xs text-ink-3 mt-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(p.published_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className="text-primary font-semibold flex items-center gap-1">Read <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
