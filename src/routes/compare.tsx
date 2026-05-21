import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "Compare MBA Colleges — CampusUpdates" }] }),
  component: Compare,
});

function Compare() {
  const [all, setAll] = useState<any[]>([]);
  const [picks, setPicks] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    supabase.from("colleges").select("*").order("name").then(({ data }) => setAll(data ?? []));
  }, []);

  const selected = picks.map((id) => all.find((c) => c.id === id));

  const fmt = (n: number | null) => (n ? `₹${(n / 100000).toFixed(2)}L` : "—");

  const chartData = useMemo(() => {
    return selected.filter(Boolean).map((s: any) => ({
      name: s.short_name || s.name.slice(0, 14),
      "Fees (₹L)": s.fees_max ? +(s.fees_max / 100000).toFixed(1) : (s.fees_min ? +(s.fees_min / 100000).toFixed(1) : 0),
      "Avg Pkg (₹L)": s.placement_avg ? +(s.placement_avg / 100000).toFixed(1) : 0,
      "High Pkg (₹L)": s.placement_high ? +(s.placement_high / 100000).toFixed(1) : 0,
    }));
  }, [selected]);

  return (
    <SiteShell>
      <div className="bg-card border-b">
        <div className="max-w-[1180px] mx-auto px-6 py-10">
          <h1 className="font-display text-3xl font-extrabold mb-2">Compare MBA Colleges</h1>
          <p className="text-ink-3">Pick up to 3 colleges side by side</p>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {picks.map((id, i) => (
            <select key={i} value={id} onChange={(e) => setPicks((p) => p.map((x, idx) => (idx === i ? e.target.value : x)))}
              className="w-full px-4 py-3 border rounded-lg text-sm bg-card outline-none focus:border-primary">
              <option value="">Select college #{i + 1}</option>
              {all.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          ))}
        </div>

        {chartData.length >= 2 && (
          <div className="bg-card border rounded-2xl p-5 mb-6">
            <h3 className="font-display font-bold mb-3">Fees vs Placements (₹ Lakhs)</h3>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Fees (₹L)" fill="#F05A26" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Avg Pkg (₹L)" fill="#1043E9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="High Pkg (₹L)" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selected.some(Boolean) && (
          <div className="bg-card border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-display font-bold w-1/4">Feature</th>
                    {selected.map((s, i) => (
                      <th key={i} className="text-left px-4 py-3 font-display font-bold">
                        {s ? s.name : <span className="text-ink-3">Not selected</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    ["Location", (s: any) => s.location],
                    ["Type", (s: any) => s.type],
                    ["Duration", (s: any) => s.duration],
                    ["Fees", (s: any) => `${fmt(s.fees_min)}${s.fees_max !== s.fees_min ? ` – ${fmt(s.fees_max)}` : ""}`],
                    ["Avg Placement", (s: any) => fmt(s.placement_avg)],
                    ["Highest Package", (s: any) => fmt(s.placement_high)],
                    ["Placement %", (s: any) => s.placement_pct ? `${s.placement_pct}%` : "—"],
                    ["CAT Cutoff", (s: any) => s.cat_cutoff ? `${s.cat_cutoff} %ile` : "—"],
                    ["Rating", (s: any) => `${s.rating}/5`],
                    ["Hostel", (s: any) => s.hostel ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-destructive" />],
                    ["Scholarship", (s: any) => s.scholarship ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-destructive" />],
                    ["Admission Open", (s: any) => s.admission_open ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-destructive" />],
                    ["Accreditations", (s: any) => (s.accreditations || []).join(", ") || "—"],
                  ].map(([label, get]: any) => (
                    <tr key={label}>
                      <td className="px-4 py-3 font-semibold text-ink-2">{label}</td>
                      {selected.map((s, i) => (
                        <td key={i} className="px-4 py-3">{s ? get(s) : "—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
