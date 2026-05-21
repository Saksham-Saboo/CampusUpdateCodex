import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Row = { id: string; name: string; short_name: string | null; location: string; logo_color: string | null };

export function SearchAutocomplete() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!q.trim()) { setItems([]); return; }
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from("colleges")
        .select("id,name,short_name,location,logo_color")
        .or(`name.ilike.%${q}%,location.ilike.%${q}%,short_name.ilike.%${q}%`)
        .limit(8);
      setItems((data ?? []) as Row[]);
      setIdx(0);
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (id: string) => { setOpen(false); setQ(""); nav({ to: "/colleges/$id", params: { id } }); };

  return (
    <div ref={wrap} className="relative flex-1 max-w-[340px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, items.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
          else if (e.key === "Enter") {
            if (items[idx]) go(items[idx].id);
            else nav({ to: "/colleges", search: { q } as never });
            setOpen(false);
          } else if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Search 1,200+ MBA colleges…"
        className="w-full pl-10 pr-3 py-2 text-[13.5px] bg-muted border-[1.5px] border-border rounded-lg outline-none focus:border-primary focus:bg-card focus:shadow-[0_0_0_3px_rgba(16,67,233,0.08)] transition"
      />
      {open && items.length > 0 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-card border rounded-xl shadow-pop overflow-hidden z-50">
          {items.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => go(c.id)}
              onMouseEnter={() => setIdx(i)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left ${i === idx ? "bg-primary-soft" : "hover:bg-muted"}`}
            >
              <div className="w-8 h-8 rounded-md flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                style={{ background: c.logo_color || "#1043E9" }}>
                {(c.short_name || c.name).slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{c.name}</div>
                <div className="text-xs text-ink-3 truncate">{c.location}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
