import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Download, Plus, Pencil, Trash2 } from "lucide-react";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

const cls = "w-full px-3 py-2 border rounded-lg outline-none focus:border-primary text-sm bg-card";

function csv(rows: any[], cols: { key: string; label: string }[], filename: string) {
  const header = cols.map((c) => c.label).join(",");
  const body = rows.map((r) =>
    cols.map((c) => `"${(r[c.key] ?? "").toString().replace(/"/g, '""')}"`).join(",")
  ).join("\n");
  const blob = new Blob([header + "\n" + body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

/* ============== LOAN LEADS ============== */
export function LoanLeadsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bank, setBank] = useState(""); const [status, setStatus] = useState("");
  const [amount, setAmount] = useState(""); const [from, setFrom] = useState(""); const [to, setTo] = useState("");

  const load = () => {
    setLoading(true);
    supabase.from("loan_leads").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setRows(data ?? []); setLoading(false); });
  };
  useEffect(load, []);

  const filtered = useMemo(() => rows.filter((r) =>
    (!bank || r.preferred_bank === bank) &&
    (!status || r.status === status) &&
    (!amount || r.loan_amount === amount) &&
    (!from || new Date(r.created_at) >= new Date(from)) &&
    (!to || new Date(r.created_at) <= new Date(to + "T23:59:59"))
  ), [rows, bank, status, amount, from, to]);

  const updateStatus = async (id: string, s: string) => {
    await supabase.from("loan_leads").update({ status: s }).eq("id", id);
    toast.success("Status updated"); load();
  };

  const stats = [
    { l: "Total Loan Leads", v: rows.length, c: "bg-primary-soft text-primary" },
    { l: "New Today", v: rows.filter((r) => new Date(r.created_at).toDateString() === new Date().toDateString()).length, c: "bg-accent-soft text-accent" },
    { l: "Contacted", v: rows.filter((r) => r.status === "Contacted").length, c: "bg-success-soft text-success" },
    { l: "Closed", v: rows.filter((r) => r.status === "Closed").length, c: "bg-muted text-ink-2" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.l} className={`rounded-2xl p-4 ${s.c}`}>
            <div className="font-display text-2xl font-extrabold">{s.v}</div>
            <div className="text-xs mt-1 opacity-80">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-2xl">
        <div className="px-5 py-4 border-b flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-display font-bold">Loan Leads ({filtered.length})</h2>
          <Button size="sm" variant="outline" onClick={() => csv(filtered, [
            { key: "full_name", label: "Name" }, { key: "mobile", label: "Mobile" },
            { key: "email", label: "Email" }, { key: "city", label: "City" },
            { key: "qualification", label: "Qualification" }, { key: "preferred_college", label: "College" },
            { key: "loan_amount", label: "Loan Amount" }, { key: "preferred_bank", label: "Bank" },
            { key: "status", label: "Status" }, { key: "created_at", label: "Date" },
          ], "loan-leads.csv")} className="gap-1.5"><Download className="w-4 h-4" /> Export CSV</Button>
        </div>
        <div className="px-5 py-3 border-b flex gap-2 flex-wrap items-center text-sm">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded px-2 py-1.5 text-xs" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded px-2 py-1.5 text-xs" />
          <select value={amount} onChange={(e) => setAmount(e.target.value)} className="border rounded px-2 py-1.5 text-xs">
            <option value="">All amounts</option>
            {["Under ₹5L", "₹5L–₹10L", "₹10L–₹20L", "₹20L+"].map((x) => <option key={x}>{x}</option>)}
          </select>
          <select value={bank} onChange={(e) => setBank(e.target.value)} className="border rounded px-2 py-1.5 text-xs">
            <option value="">All banks</option>
            {["Any", "SBI", "HDFC", "ICICI", "Axis", "PNB", "Bank of Baroda"].map((x) => <option key={x}>{x}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-2 py-1.5 text-xs">
            <option value="">All status</option>
            {["New", "Contacted", "In Progress", "Closed"].map((x) => <option key={x}>{x}</option>)}
          </select>
          {(bank || status || amount || from || to) && (
            <button onClick={() => { setBank(""); setStatus(""); setAmount(""); setFrom(""); setTo(""); }} className="text-xs text-primary">Clear</button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs">
              <tr>
                <th className="px-3 py-3">Name</th><th className="px-3 py-3">Mobile</th>
                <th className="px-3 py-3">Email</th><th className="px-3 py-3">City</th>
                <th className="px-3 py-3">College</th><th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Bank</th><th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? <tr><td colSpan={9} className="text-center py-10 text-ink-3">Loading…</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={9} className="text-center py-10 text-ink-3">No loan leads found.</td></tr>
              : filtered.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-3 font-semibold">{r.full_name}</td>
                  <td className="px-3 py-3"><a href={`tel:${r.mobile}`} className="text-primary">{r.mobile}</a></td>
                  <td className="px-3 py-3 text-ink-3">{r.email}</td>
                  <td className="px-3 py-3 text-ink-3">{r.city || "—"}</td>
                  <td className="px-3 py-3 text-ink-3">{r.preferred_college || "—"}</td>
                  <td className="px-3 py-3 text-ink-3">{r.loan_amount || "—"}</td>
                  <td className="px-3 py-3 text-ink-3">{r.preferred_bank || "—"}</td>
                  <td className="px-3 py-3 text-xs text-ink-3">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-3">
                    <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="border rounded px-2 py-1 text-xs">
                      {["New", "Contacted", "In Progress", "Closed"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============== NEWS ============== */
const NEWS_CATEGORIES = ["Admission Alerts", "Policy Updates", "College News", "Exam Updates", "Scholarships"];

export function NewsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const load = () => {
    setLoading(true);
    supabase.from("news_items").select("*").order("published_date", { ascending: false })
      .then(({ data }) => { setRows(data ?? []); setLoading(false); });
  };
  useEffect(load, []);

  const togglePublish = async (r: any) => {
    await supabase.from("news_items").update({ status: r.status === "published" ? "draft" : "published" }).eq("id", r.id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this news item?")) return;
    await supabase.from("news_items").delete().eq("id", id);
    toast.success("Deleted"); load();
  };

  return (
    <div className="bg-card border rounded-2xl">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h2 className="font-display font-bold">News ({rows.length})</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditing(null)} className="gap-1.5"><Plus className="w-4 h-4" /> Add News</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit News" : "Add News"}</DialogTitle></DialogHeader>
            <NewsForm initial={editing} onSaved={() => { setOpen(false); setEditing(null); load(); }} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs">
            <tr><th className="px-3 py-3">Title</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Source</th><th className="px-3 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan={6} className="text-center py-10 text-ink-3">Loading…</td></tr>
            : rows.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-ink-3">No news yet.</td></tr>
            : rows.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-3 font-semibold max-w-[260px] truncate">{r.title}</td>
                <td className="px-3 py-3 text-xs">{r.category}</td>
                <td className="px-3 py-3">
                  <button onClick={() => togglePublish(r)} className={`text-xs px-2 py-1 rounded ${r.status === "published" ? "bg-success-soft text-success" : "bg-muted text-ink-3"}`}>
                    {r.status === "published" ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-3 py-3 text-xs text-ink-3">{new Date(r.published_date).toLocaleDateString()}</td>
                <td className="px-3 py-3 text-xs"><a href={r.source_url || "#"} target="_blank" className="text-primary truncate max-w-[140px] block">{r.source_url ? "external" : "internal"}</a></td>
                <td className="px-3 py-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewsForm({ initial, onSaved }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(initial || {
    title: "", slug: "", category: NEWS_CATEGORIES[0], excerpt: "", content: "",
    source_url: "", cover_image_url: "", published_date: new Date().toISOString().slice(0, 10), status: "draft",
  });
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || slugify(form.title);
    const payload = { ...form, slug };
    const { error } = initial
      ? await supabase.from("news_items").update(payload).eq("id", initial.id)
      : await supabase.from("news_items").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Updated" : "Added"); onSaved();
  };

  const upload = async (file: File) => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `news/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("college-images").upload(path, file);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("college-images").getPublicUrl(path);
    set("cover_image_url", data.publicUrl); toast.success("Uploaded");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div><label className="text-xs font-semibold mb-1 block">Title *</label>
        <input required value={form.title} onChange={(e) => { set("title", e.target.value); if (!initial) set("slug", slugify(e.target.value)); }} className={cls} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold mb-1 block">Slug</label>
          <input value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} className={cls} /></div>
        <div><label className="text-xs font-semibold mb-1 block">Category *</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={cls}>
            {NEWS_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select></div>
      </div>
      <div><label className="text-xs font-semibold mb-1 block">Excerpt (max 200)</label>
        <textarea maxLength={200} rows={2} value={form.excerpt || ""} onChange={(e) => set("excerpt", e.target.value)} className={cls} /></div>
      <div><label className="text-xs font-semibold mb-1 block">Full Content (HTML allowed)</label>
        <textarea rows={8} value={form.content || ""} onChange={(e) => set("content", e.target.value)} className={cls} placeholder="<p>Your content…</p>" /></div>
      <div><label className="text-xs font-semibold mb-1 block">External Source URL (optional)</label>
        <input value={form.source_url || ""} onChange={(e) => set("source_url", e.target.value)} className={cls} placeholder="https://…" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold mb-1 block">Published Date</label>
          <input type="date" value={form.published_date} onChange={(e) => set("published_date", e.target.value)} className={cls} /></div>
        <div><label className="text-xs font-semibold mb-1 block">Status</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className={cls}>
            <option value="draft">Draft</option><option value="published">Published</option>
          </select></div>
      </div>
      <div><label className="text-xs font-semibold mb-1 block">Cover Image (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="text-xs" />
        {form.cover_image_url && <img src={form.cover_image_url} alt="" className="mt-2 w-32 h-20 object-cover rounded border" />}
      </div>
      <Button type="submit" disabled={saving} className="w-full">{saving ? "Saving…" : initial ? "Update" : "Add"}</Button>
    </form>
  );
}

/* ============== BLOG ============== */
const BLOG_CATEGORIES = ["Admissions", "College Reviews", "Career Guidance", "Entrance Exams", "Scholarships", "Rankings", "Tips"];

export function BlogAdmin({ defaultAuthor }: { defaultAuthor?: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const load = () => {
    setLoading(true);
    supabase.from("blog_posts").select("*").order("published_date", { ascending: false })
      .then(({ data }) => { setRows(data ?? []); setLoading(false); });
  };
  useEffect(load, []);

  const togglePublish = async (r: any) => {
    await supabase.from("blog_posts").update({ status: r.status === "published" ? "draft" : "published" }).eq("id", r.id);
    load();
  };
  const toggleFeatured = async (r: any) => {
    await supabase.from("blog_posts").update({ is_featured: !r.is_featured }).eq("id", r.id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("Deleted"); load();
  };

  return (
    <div className="bg-card border rounded-2xl">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h2 className="font-display font-bold">Blog Posts ({rows.length})</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditing(null)} className="gap-1.5"><Plus className="w-4 h-4" /> Add Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Post" : "Add Post"}</DialogTitle></DialogHeader>
            <BlogForm initial={editing} defaultAuthor={defaultAuthor} onSaved={() => { setOpen(false); setEditing(null); load(); }} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs">
            <tr><th className="px-3 py-3">Title</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Author</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Featured</th><th className="px-3 py-3">Date</th><th className="px-3 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan={7} className="text-center py-10 text-ink-3">Loading…</td></tr>
            : rows.length === 0 ? <tr><td colSpan={7} className="text-center py-10 text-ink-3">No blog posts yet.</td></tr>
            : rows.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-3 font-semibold max-w-[240px] truncate">{r.title}</td>
                <td className="px-3 py-3 text-xs">{r.category}</td>
                <td className="px-3 py-3 text-xs text-ink-3">{r.author_name || "—"}</td>
                <td className="px-3 py-3">
                  <button onClick={() => togglePublish(r)} className={`text-xs px-2 py-1 rounded ${r.status === "published" ? "bg-success-soft text-success" : "bg-muted text-ink-3"}`}>
                    {r.status === "published" ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-3 py-3">
                  <button onClick={() => toggleFeatured(r)} className={`text-xs px-2 py-1 rounded ${r.is_featured ? "bg-accent-soft text-accent" : "bg-muted text-ink-3"}`}>
                    {r.is_featured ? "★ Featured" : "—"}
                  </button>
                </td>
                <td className="px-3 py-3 text-xs text-ink-3">{new Date(r.published_date).toLocaleDateString()}</td>
                <td className="px-3 py-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BlogForm({ initial, defaultAuthor, onSaved }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(initial || {
    title: "", slug: "", category: BLOG_CATEGORIES[0], cover_image_url: "", excerpt: "", content: "",
    author_name: defaultAuthor || "", published_date: new Date().toISOString().slice(0, 10),
    status: "draft", is_featured: false,
  });
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || slugify(form.title);
    const payload = { ...form, slug };
    const { error } = initial
      ? await supabase.from("blog_posts").update(payload).eq("id", initial.id)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Updated" : "Added"); onSaved();
  };

  const upload = async (file: File) => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("college-images").upload(path, file);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("college-images").getPublicUrl(path);
    set("cover_image_url", data.publicUrl); toast.success("Uploaded");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div><label className="text-xs font-semibold mb-1 block">Title *</label>
        <input required value={form.title} onChange={(e) => { set("title", e.target.value); if (!initial) set("slug", slugify(e.target.value)); }} className={cls} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold mb-1 block">Slug</label>
          <input value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} className={cls} /></div>
        <div><label className="text-xs font-semibold mb-1 block">Category *</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={cls}>
            {BLOG_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select></div>
      </div>
      <div><label className="text-xs font-semibold mb-1 block">Excerpt (max 200)</label>
        <textarea maxLength={200} rows={2} value={form.excerpt || ""} onChange={(e) => set("excerpt", e.target.value)} className={cls} /></div>
      <div><label className="text-xs font-semibold mb-1 block">Full Content (HTML allowed: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;img&gt;)</label>
        <textarea rows={10} value={form.content || ""} onChange={(e) => set("content", e.target.value)} className={cls} placeholder="<p>Your content…</p>" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold mb-1 block">Author</label>
          <input value={form.author_name || ""} onChange={(e) => set("author_name", e.target.value)} className={cls} /></div>
        <div><label className="text-xs font-semibold mb-1 block">Published Date</label>
          <input type="date" value={form.published_date} onChange={(e) => set("published_date", e.target.value)} className={cls} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold mb-1 block">Status</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className={cls}>
            <option value="draft">Draft</option><option value="published">Published</option>
          </select></div>
        <label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={!!form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} /> Featured on homepage</label>
      </div>
      <div><label className="text-xs font-semibold mb-1 block">Cover Image</label>
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="text-xs" />
        {form.cover_image_url && <img src={form.cover_image_url} alt="" className="mt-2 w-32 h-20 object-cover rounded border" />}
      </div>
      <Button type="submit" disabled={saving} className="w-full">{saving ? "Saving…" : initial ? "Update" : "Add"}</Button>
    </form>
  );
}
