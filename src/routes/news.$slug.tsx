import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar } from "lucide-react";

export const Route = createFileRoute("/news/$slug")({
  component: NewsDetail,
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const [n, setN] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("news_items").select("*").eq("slug", slug).eq("status", "published").maybeSingle()
      .then(({ data }) => { setN(data); setLoading(false); });
  }, [slug]);

  if (loading) return <SiteShell><div className="max-w-[760px] mx-auto px-6 py-20">Loading…</div></SiteShell>;
  if (!n) return <SiteShell><div className="max-w-[760px] mx-auto px-6 py-20 text-center">
    <h1 className="font-display text-2xl font-bold mb-3">Article not found</h1>
    <Link to="/news" className="text-primary">← Back to News</Link>
  </div></SiteShell>;

  return (
    <SiteShell>
      <article className="max-w-[760px] mx-auto px-6 py-10">
        <Link to="/news" className="inline-flex items-center gap-1 text-sm text-ink-3 hover:text-primary mb-5">
          <ArrowLeft className="w-4 h-4" /> All news
        </Link>
        <span className="text-xs font-bold uppercase tracking-wide text-primary">{n.category}</span>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-3 mb-4 leading-tight">{n.title}</h1>
        <div className="flex items-center gap-2 text-sm text-ink-3 mb-7">
          <Calendar className="w-4 h-4" />
          {new Date(n.published_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </div>
        {n.cover_image_url && <img src={n.cover_image_url} alt={n.title} className="w-full rounded-2xl mb-7" />}
        {n.excerpt && <p className="text-lg text-ink-2 mb-5 leading-relaxed font-medium">{n.excerpt}</p>}
        <div className="prose prose-slate max-w-none text-ink-2 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: n.content || "" }} />
      </article>
    </SiteShell>
  );
}
