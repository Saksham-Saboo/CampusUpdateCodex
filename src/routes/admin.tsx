import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Download, Plus, Pencil, Trash2, Users, FileText, GraduationCap, MessageSquare, Banknote, Newspaper, BookOpen, BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LoanLeadsAdmin, NewsAdmin, BlogAdmin } from "@/components/admin/AdminContent";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { BulkImportColleges } from "@/components/admin/BulkImportColleges";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — CampusUpdates" }] }),
  component: Admin,
});

function Admin() {
  const { user, role, loading } = useAuth();
  const nav = useNavigate();
  const [colleges, setColleges] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      if (!user) nav({ to: "/auth" });
    }
  }, [user, role, loading, nav]);

  const load = async () => {
    const [{ data: c }, { data: a }, { data: l }] = await Promise.all([
      supabase.from("colleges").select("*").order("created_at", { ascending: false }),
      supabase.from("applications").select("*, colleges(name), profiles!inner(full_name, email, phone)").order("created_at", { ascending: false }),
      supabase.from("counselling_leads").select("*").order("created_at", { ascending: false }),
    ]);
    setColleges(c ?? []); setApps(a ?? []); setLeads(l ?? []);
  };

  useEffect(() => { if (role === "admin") load(); }, [role]);

  if (loading) return <SiteShell><div className="p-20 text-center">Loading…</div></SiteShell>;
  if (!user) return null;
  if (role !== "admin") {
    return (
      <SiteShell>
        <div className="max-w-md mx-auto p-12 text-center">
          <h1 className="font-display text-2xl font-bold mb-3">Admin access required</h1>
          <p className="text-ink-3 mb-5">Your account doesn't have admin privileges. Contact your team to grant access.</p>
          <p className="text-xs text-ink-3 mb-5">User ID: <code className="bg-muted px-1.5 py-0.5 rounded">{user.id}</code></p>
          <Link to="/dashboard"><Button>Go to dashboard</Button></Link>
        </div>
      </SiteShell>
    );
  }

  const downloadCSV = (rows: any[], cols: { key: string; label: string }[], filename: string) => {
    const header = cols.map((c) => c.label).join(",");
    const body = rows.map((r) =>
      cols.map((c) => {
        const v = c.key.includes(".") ? c.key.split(".").reduce((o, k) => o?.[k], r) : r[c.key];
        const s = (v ?? "").toString().replace(/"/g, '""');
        return `"${s}"`;
      }).join(",")
    ).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  };

  const deleteCollege = async (id: string) => {
    if (!confirm("Delete this college? Applications referencing it will also be removed.")) return;
    const { error } = await supabase.from("colleges").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  const updateAppStatus = async (id: string, status: string) => {
    await supabase.from("applications").update({ status: status as any }).eq("id", id);
    toast.success("Status updated"); load();
  };

  const stats = [
    { i: GraduationCap, l: "Colleges", v: colleges.length, c: "bg-primary-soft text-primary" },
    { i: FileText, l: "Applications", v: apps.length, c: "bg-accent-soft text-accent" },
    { i: MessageSquare, l: "Counselling Leads", v: leads.length, c: "bg-success-soft text-success" },
    { i: Users, l: "New leads (24h)", v: leads.filter((l) => Date.now() - new Date(l.created_at).getTime() < 86400000).length, c: "bg-purple-100 text-purple-700" },
  ];

  return (
    <SiteShell>
      <div className="bg-card border-b">
        <div className="max-w-[1240px] mx-auto px-6 py-7 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold">Super Admin Panel</h1>
            <p className="text-sm text-ink-3">Manage colleges, applications and counselling leads</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ i: I, l, v, c }) => (
            <div key={l} className="bg-card border rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${c} flex items-center justify-center mb-3`}><I className="w-5 h-5" /></div>
              <div className="font-display text-2xl font-extrabold">{v}</div>
              <div className="text-xs text-ink-3 mt-1">{l}</div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="analytics">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="analytics"><BarChart3 className="w-4 h-4 mr-1.5" />Analytics</TabsTrigger>
            <TabsTrigger value="colleges"><GraduationCap className="w-4 h-4 mr-1.5" />Colleges</TabsTrigger>
            <TabsTrigger value="applications"><FileText className="w-4 h-4 mr-1.5" />Applications</TabsTrigger>
            <TabsTrigger value="leads"><MessageSquare className="w-4 h-4 mr-1.5" />Counselling Leads</TabsTrigger>
            <TabsTrigger value="loan"><Banknote className="w-4 h-4 mr-1.5" />Loan Leads</TabsTrigger>
            <TabsTrigger value="news"><Newspaper className="w-4 h-4 mr-1.5" />News</TabsTrigger>
            <TabsTrigger value="blog"><BookOpen className="w-4 h-4 mr-1.5" />Blog</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>

          {/* COLLEGES */}
          <TabsContent value="colleges">
            <div className="bg-card border rounded-2xl">
              <div className="px-5 py-4 border-b flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-display font-bold">Colleges Catalogue ({colleges.length})</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <BulkImportColleges onDone={load} />
                  <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setEditing(null)} className="gap-1.5">
                        <Plus className="w-4 h-4" /> Add college
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader><DialogTitle>{editing ? "Edit college" : "Add college"}</DialogTitle></DialogHeader>
                      <CollegeForm initial={editing} onSaved={() => { setOpen(false); setEditing(null); load(); }} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-left text-xs">
                    <tr>
                      <th className="px-4 py-3">Name</th><th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Type</th><th className="px-4 py-3">Fees</th>
                      <th className="px-4 py-3">Apply Link</th><th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {colleges.map((c) => (
                      <tr key={c.id}>
                        <td className="px-4 py-3 font-semibold">{c.name}</td>
                        <td className="px-4 py-3 text-ink-3">{c.location}</td>
                        <td className="px-4 py-3 text-ink-3">{c.type || "—"}</td>
                        <td className="px-4 py-3">{c.fees_min ? `₹${(c.fees_min / 100000).toFixed(1)}L` : "—"}</td>
                        <td className="px-4 py-3 text-xs"><a href={c.apply_link || "#"} target="_blank" className="text-primary truncate max-w-[180px] block">{c.apply_link || "—"}</a></td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded ${c.admission_open ? "bg-success-soft text-success" : "bg-muted text-ink-3"}`}>
                            {c.admission_open ? "Open" : "Closed"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteCollege(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* APPLICATIONS */}
          <TabsContent value="applications">
            <div className="bg-card border rounded-2xl">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h2 className="font-display font-bold">Student Applications ({apps.length})</h2>
                <Button size="sm" variant="outline" onClick={() => downloadCSV(apps.map((a) => ({
                  ...a, college_name: a.colleges?.name, student_name: a.profiles?.full_name,
                  student_email: a.profiles?.email, student_phone: a.profiles?.phone,
                })), [
                  { key: "student_name", label: "Student" },
                  { key: "student_email", label: "Email" },
                  { key: "student_phone", label: "Phone" },
                  { key: "college_name", label: "College" },
                  { key: "status", label: "Status" },
                  { key: "created_at", label: "Applied At" },
                ], "applications.csv")} className="gap-1.5">
                  <Download className="w-4 h-4" /> Export CSV
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-left text-xs">
                    <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">College</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {apps.map((a) => (
                      <tr key={a.id}>
                        <td className="px-4 py-3 font-semibold">{a.profiles?.full_name || "—"}</td>
                        <td className="px-4 py-3 text-ink-3">{a.profiles?.email}</td>
                        <td className="px-4 py-3">{a.colleges?.name}</td>
                        <td className="px-4 py-3">
                          <select value={a.status} onChange={(e) => updateAppStatus(a.id, e.target.value)} className="border rounded px-2 py-1 text-xs">
                            {["submitted", "under_review", "accepted", "rejected", "waitlisted"].map((s) => (
                              <option key={s} value={s}>{s.replace("_", " ")}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-ink-3 text-xs">{new Date(a.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                    {apps.length === 0 && <tr><td colSpan={5} className="text-center text-ink-3 py-10">No applications yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* LEADS */}
          <TabsContent value="leads">
            <div className="bg-card border rounded-2xl">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h2 className="font-display font-bold">Counselling Leads ({leads.length})</h2>
                <Button size="sm" variant="outline" onClick={() => downloadCSV(leads, [
                  { key: "full_name", label: "Name" }, { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" }, { key: "city", label: "City" },
                  { key: "degree", label: "Degree" }, { key: "budget", label: "Budget" },
                  { key: "message", label: "Message" }, { key: "status", label: "Status" },
                  { key: "created_at", label: "Submitted At" },
                ], "counselling-leads.csv")} className="gap-1.5">
                  <Download className="w-4 h-4" /> Export CSV
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-left text-xs">
                    <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">City</th><th className="px-4 py-3">Degree</th><th className="px-4 py-3">Budget</th><th className="px-4 py-3">Date</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {leads.map((l) => (
                      <tr key={l.id}>
                        <td className="px-4 py-3 font-semibold">{l.full_name}</td>
                        <td className="px-4 py-3"><a href={`tel:${l.phone}`} className="text-primary">{l.phone}</a></td>
                        <td className="px-4 py-3 text-ink-3">{l.email}</td>
                        <td className="px-4 py-3 text-ink-3">{l.city || "—"}</td>
                        <td className="px-4 py-3 text-ink-3">{l.degree || "—"}</td>
                        <td className="px-4 py-3 text-ink-3">{l.budget || "—"}</td>
                        <td className="px-4 py-3 text-ink-3 text-xs">{new Date(l.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                    {leads.length === 0 && <tr><td colSpan={7} className="text-center text-ink-3 py-10">No leads yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="loan"><LoanLeadsAdmin /></TabsContent>
          <TabsContent value="news"><NewsAdmin /></TabsContent>
          <TabsContent value="blog"><BlogAdmin defaultAuthor={user?.email?.split("@")[0]} /></TabsContent>
        </Tabs>
      </div>
    </SiteShell>
  );
}

function CollegeForm({ initial, onSaved }: { initial: any; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<any>(initial || {
    name: "", short_name: "", location: "", type: "Full-time MBA", degree: "MBA", description: "",
    fees_min: 0, fees_max: 0, duration: "2 years", rating: 4.5, logo_color: "#1043E9",
    apply_link: "", admission_open: true, featured: false, placement_avg: 0, placement_high: 0,
    tags: [], accreditations: [], image_url: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      tags: typeof form.tags === "string" ? form.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : form.tags,
      accreditations: typeof form.accreditations === "string" ? form.accreditations.split(",").map((s: string) => s.trim()).filter(Boolean) : form.accreditations,
      fees_min: Number(form.fees_min) || null, fees_max: Number(form.fees_max) || null,
      placement_avg: Number(form.placement_avg) || null, placement_high: Number(form.placement_high) || null,
      rating: Number(form.rating) || 4.0,
      cat_cutoff: form.cat_cutoff ? Number(form.cat_cutoff) : null,
      placement_pct: form.placement_pct ? Number(form.placement_pct) : null,
    };
    const { error } = initial
      ? await supabase.from("colleges").update(payload).eq("id", initial.id)
      : await supabase.from("colleges").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Updated" : "Added");
    onSaved();
  };

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={submit} className="space-y-3 text-sm">
      <Row><L label="Name *"><input required value={form.name} onChange={(e) => set("name", e.target.value)} className={cls} /></L>
        <L label="Short name"><input value={form.short_name || ""} onChange={(e) => set("short_name", e.target.value)} className={cls} /></L></Row>
      <Row><L label="Location *"><input required value={form.location} onChange={(e) => set("location", e.target.value)} className={cls} /></L>
        <L label="Type"><input value={form.type || ""} onChange={(e) => set("type", e.target.value)} className={cls} placeholder="Online MBA" /></L></Row>
      <L label="Description"><textarea rows={3} value={form.description || ""} onChange={(e) => set("description", e.target.value)} className={cls} /></L>
      <Row><L label="Fees min (₹)"><input type="number" value={form.fees_min} onChange={(e) => set("fees_min", e.target.value)} className={cls} /></L>
        <L label="Fees max (₹)"><input type="number" value={form.fees_max} onChange={(e) => set("fees_max", e.target.value)} className={cls} /></L>
        <L label="Duration"><input value={form.duration || ""} onChange={(e) => set("duration", e.target.value)} className={cls} /></L></Row>
      <Row><L label="Rating"><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => set("rating", e.target.value)} className={cls} /></L>
        <L label="Logo color"><input type="color" value={form.logo_color || "#1043E9"} onChange={(e) => set("logo_color", e.target.value)} className="w-full h-10 border rounded-lg" /></L></Row>
      <L label="Apply / Bitly link"><input value={form.apply_link || ""} onChange={(e) => set("apply_link", e.target.value)} className={cls} placeholder="https://bit.ly/..." /></L>
      <L label="College image">
        <div className="flex gap-3 items-start">
          <div className="flex-1 space-y-2">
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
                setUploading(true);
                const ext = file.name.split(".").pop() || "jpg";
                const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
                const { error: upErr } = await supabase.storage.from("college-images").upload(path, file, { cacheControl: "3600", upsert: false });
                if (upErr) { setUploading(false); toast.error(upErr.message); return; }
                const { data: { publicUrl } } = supabase.storage.from("college-images").getPublicUrl(path);
                set("image_url", publicUrl);
                setUploading(false);
                toast.success("Image uploaded");
              }}
              className="block w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-medium file:cursor-pointer cursor-pointer"
            />
            {uploading && <p className="text-[11px] text-ink-3">Uploading…</p>}
            {form.image_url && (
              <div className="flex items-center gap-2">
                <input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} className={`${cls} text-[11px]`} />
                <Button type="button" size="sm" variant="ghost" onClick={() => set("image_url", "")}>Clear</Button>
              </div>
            )}
          </div>
          {form.image_url && (
            <img src={form.image_url} alt="preview" className="w-24 h-16 object-cover rounded-lg border shrink-0" onError={(e) => ((e.currentTarget.style.display = "none"))} />
          )}
        </div>
        <p className="text-[11px] text-ink-3 mt-1">Upload a campus photo (JPG/PNG, up to 5MB). Shown on the college card and detail page.</p>
      </L>
      <Row><L label="Avg placement (₹)"><input type="number" value={form.placement_avg || 0} onChange={(e) => set("placement_avg", e.target.value)} className={cls} /></L>
        <L label="Highest package (₹)"><input type="number" value={form.placement_high || 0} onChange={(e) => set("placement_high", e.target.value)} className={cls} /></L></Row>
      <L label="Tags (comma separated)"><input value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags} onChange={(e) => set("tags", e.target.value)} className={cls} /></L>
      <L label="Accreditations (comma separated)"><input value={Array.isArray(form.accreditations) ? form.accreditations.join(", ") : form.accreditations} onChange={(e) => set("accreditations", e.target.value)} className={cls} /></L>
      <Row>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.admission_open} onChange={(e) => set("admission_open", e.target.checked)} /> Admission open</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.sponsored} onChange={(e) => set("sponsored", e.target.checked)} /> ★ Sponsored</label>
      </Row>
      <Row>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.hostel} onChange={(e) => set("hostel", e.target.checked)} /> Hostel</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.scholarship} onChange={(e) => set("scholarship", e.target.checked)} /> Scholarship</label>
      </Row>
      <Row>
        <L label="CAT Cutoff (%ile)"><input type="number" step="0.1" value={form.cat_cutoff || ""} onChange={(e) => set("cat_cutoff", e.target.value)} className={cls} /></L>
        <L label="Placement %"><input type="number" value={form.placement_pct || ""} onChange={(e) => set("placement_pct", e.target.value)} className={cls} /></L>
      </Row>
      <Button type="submit" disabled={saving} className="w-full mt-2">{saving ? "Saving…" : initial ? "Update college" : "Add college"}</Button>
    </form>
  );
}

const cls = "w-full px-3 py-2 border rounded-lg outline-none focus:border-primary";
const Row = ({ children }: any) => <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{children}</div>;
const L = ({ label, children }: any) => (
  <div><label className="text-xs font-semibold text-ink-2 block mb-1">{label}</label>{children}</div>
);
