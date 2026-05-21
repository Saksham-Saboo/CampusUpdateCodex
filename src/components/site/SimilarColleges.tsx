import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function SimilarColleges({ college }: { college: any }) {
  const [items, setItems] = useState<any[] | null>(null);
  useEffect(() => {
    const min = (college.fees_min || 0) * 0.5;
    const max = (college.fees_max || college.fees_min || 1000000) * 1.6 || 99999999;
    supabase
      .from("colleges")
      .select("id,name,short_name,location,logo_color,type,fees_min,fees_max,rating")
      .neq("id", college.id)
      .eq("type", college.type || "")
      .gte("fees_min", min)
      .lte("fees_min", max)
      .order("rating", { ascending: false })
      .limit(3)
      .then(({ data }) => setItems(data ?? []));
  }, [college.id]);

  if (items === null) {
    return <div className="grid sm:grid-cols-3 gap-3 mt-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>;
  }
  if (items.length === 0) return null;

  const fmt = (n: number | null) => (n ? `₹${(n / 100000).toFixed(1)}L` : "—");

  return (
    <section className="bg-card border rounded-2xl p-6 mb-6">
      <h2 className="font-display text-lg font-bold mb-3">Colleges like this</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {items.map((s) => (
          <Link key={s.id} to="/colleges/$id" params={{ id: s.id }} className="border rounded-xl p-3 hover:border-primary hover:shadow-card transition block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-md flex items-center justify-center text-white text-[11px] font-bold"
                style={{ background: s.logo_color || "#1043E9" }}>
                {(s.short_name || s.name).slice(0, 2).toUpperCase()}
              </div>
              <div className="text-sm font-semibold leading-tight line-clamp-2">{s.name}</div>
            </div>
            <div className="text-xs text-ink-3 flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.location}</div>
            <div className="text-xs text-ink-3 mt-1 flex items-center justify-between">
              <span>{fmt(s.fees_min)}</span>
              <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-warning text-warning" /> {s.rating?.toFixed(1)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
