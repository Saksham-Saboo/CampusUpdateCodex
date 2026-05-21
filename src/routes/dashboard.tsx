import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Bookmark, FileText, GraduationCap, ExternalLink, Trash2, Heart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CampusUpdates" }] }),
  component: Dashboard,
});

const STATUS_COLOR: Record<string, string> = {
  submitted: "bg-primary-soft text-primary",
  under_review: "bg-warning/15 text-warning",
  accepted: "bg-success-soft text-success",
  rejected: "bg-destructive/10 text-destructive",
  waitlisted: "bg-purple-100 text-purple-700",
};

function Dashboard() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading, nav]);

  const load = async () => {
    if (!user) return;
    const [{ data: p }, { data: a }, { data: s }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("applications").select("*, colleges(*)").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("saved_colleges").select("*, colleges(*)").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    setProfile(p); setApps(a ?? []); setSaved(s ?? []);
  };
  useEffect(() => { load(); }, [user]);

  if (!user) return null;

  const removeApp = async (id: string) => {
    await supabase.from("applications").delete().eq("id", id);
    toast.success("Application removed"); load();
  };
  const unsave = async (id: string) => {
    await supabase.from("saved_colleges").delete().eq("id", id);
    load();
  };

  const stats = [
    { i: FileText, l: "Applications", v: apps.length, c: "bg-primary-soft text-primary" },
    { i: Bookmark, l: "Saved colleges", v: saved.length, c: "bg-accent-soft text-accent" },
    { i: GraduationCap, l: "Accepted", v: apps.filter((a) => a.status === "accepted").length, c: "bg-success-soft text-success" },
  ];

  return (
    <SiteShell>
      <div className="bg-card border-b">
        <div className="max-w-[1180px] mx-auto px-6 py-8">
          <h1 className="font-display text-2xl font-extrabold mb-1">Welcome, {profile?.full_name || "there"} 👋</h1>
          <p className="text-ink-3 text-sm">Here's an overview of your MBA journey</p>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(({ i: I, l, v, c }) => (
            <div key={l} className="bg-card border rounded-2xl p-5">
              <div className={`w-11 h-11 rounded-xl ${c} flex items-center justify-center mb-3`}>
                <I className="w-5 h-5" />
              </div>
              <div className="font-display text-3xl font-extrabold">{v}</div>
              <div className="text-xs text-ink-3 mt-1">{l}</div>
            </div>
          ))}
        </div>

        <section className="bg-card border rounded-2xl mb-6">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h2 className="font-display font-bold">My Applications</h2>
            <Link to="/colleges" search={{ q: "" } as never}><Button size="sm" variant="outline">+ Apply to more</Button></Link>
          </div>
          {apps.length === 0 ? (
            <div className="p-10 text-center text-ink-3">
              No applications yet. <Link to="/colleges" search={{ q: "" } as never} className="text-primary font-semibold">Browse colleges →</Link>
            </div>
          ) : (
            <div className="divide-y">
              {apps.map((a) => (
                <div key={a.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center font-display font-bold text-white text-sm shrink-0"
                    style={{ background: a.colleges?.logo_color || "#1043E9" }}>
                    {(a.colleges?.short_name || a.colleges?.name || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{a.colleges?.name}</div>
                    <div className="text-xs text-ink-3">{a.colleges?.location} • Applied {new Date(a.created_at).toLocaleDateString()}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded ${STATUS_COLOR[a.status]}`}>
                    {a.status.replace("_", " ")}
                  </span>
                  {a.colleges?.apply_link && (
                    <a href={a.colleges.apply_link} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline"><ExternalLink className="w-3.5 h-3.5" /></Button>
                    </a>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => removeApp(a.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-card border rounded-2xl">
          <div className="px-5 py-4 border-b">
            <h2 className="font-display font-bold">Saved Colleges</h2>
          </div>
          {saved.length === 0 ? (
            <div className="p-10 text-center text-ink-3">No saved colleges yet.</div>
          ) : (
            <div className="divide-y">
              {saved.map((s) => (
                <div key={s.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center font-display font-bold text-white text-sm shrink-0"
                    style={{ background: s.colleges?.logo_color || "#1043E9" }}>
                    {(s.colleges?.short_name || s.colleges?.name || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to="/colleges/$id" params={{ id: s.colleges.id }} className="font-semibold hover:text-primary truncate block">
                      {s.colleges?.name}
                    </Link>
                    <div className="text-xs text-ink-3">{s.colleges?.location}</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => unsave(s.id)}>
                    <Heart className="w-4 h-4 fill-accent text-accent" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </SiteShell>
  );
}
