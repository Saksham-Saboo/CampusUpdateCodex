import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, User } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetail,
});

function BlogDetail() {
  const { slug } = Route.useParams();
  const [p, setP] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle()
      .then(({ data }) => { setP(data); setLoading(false); });
  }, [slug]);

  if (loading) return <SiteShell><div className="max-w-[760px] mx-auto px-6 py-20">Loading…</div></SiteShell>;
  if (!p) return <SiteShell><div className="max-w-[760px] mx-auto px-6 py-20 text-center">
    <h1 className="font-display text-2xl font-bold mb-3">Post not found</h1>
    <Link to="/blog" className="text-primary">← Back to Blog</Link>
  </div></SiteShell>;

  return (
    <SiteShell>
      <article className="max-w-[760px] mx-auto px-6 py-10">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-ink-3 hover:text-primary mb-5">
          <ArrowLeft className="w-4 h-4" /> All posts
        </Link>
        <span className="text-xs font-bold uppercase tracking-wide text-primary bg-primary-soft px-2 py-1 rounded">{p.category}</span>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-4 mb-4 leading-tight">{p.title}</h1>
        <div className="flex items-center gap-4 text-sm text-ink-3 mb-7">
          {p.author_name && <span className="flex items-center gap-1"><User className="w-4 h-4" /> {p.author_name}</span>}
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />
            {new Date(p.published_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
        {p.cover_image_url && <img src={p.cover_image_url} alt={p.title} className="w-full rounded-2xl mb-7" />}
        {p.excerpt && <p className="text-lg text-ink-2 mb-5 leading-relaxed font-medium">{p.excerpt}</p>}
        <div className="prose prose-slate max-w-none text-ink-2 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: p.content || "" }} />
      </article>
    </SiteShell>
  );
}
