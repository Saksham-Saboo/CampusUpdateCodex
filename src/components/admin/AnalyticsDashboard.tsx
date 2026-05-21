import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

type Daily = { date: string; leads: number; apps: number };

export function AnalyticsDashboard() {
  const [daily, setDaily] = useState<Daily[]>([]);
  const [topColleges, setTopColleges] = useState<{ name: string; count: number }[]>([]);
  const [funnel, setFunnel] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 13 * 86400000).toISOString();
      const [{ data: leads }, { data: apps }, { data: brochures }, { data: magnets }] = await Promise.all([
        supabase.from("counselling_leads").select("created_at").gte("created_at", since),
        supabase.from("applications").select("created_at, college_id, colleges(name)").gte("created_at", since),
        supabase.from("brochure_requests").select("id"),
        supabase.from("lead_magnet_downloads").select("id"),
      ]);

      const days: Record<string, Daily> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const k = d.toISOString().slice(5, 10);
        days[k] = { date: k, leads: 0, apps: 0 };
      }
      (leads ?? []).forEach((l: any) => { const k = l.created_at.slice(5, 10); if (days[k]) days[k].leads++; });
      (apps ?? []).forEach((a: any) => { const k = a.created_at.slice(5, 10); if (days[k]) days[k].apps++; });
      setDaily(Object.values(days));

      const tc: Record<string, { name: string; count: number }> = {};
      (apps ?? []).forEach((a: any) => {
        const n = a.colleges?.name || "Unknown";
        if (!tc[n]) tc[n] = { name: n, count: 0 };
        tc[n].count++;
      });
      setTopColleges(Object.values(tc).sort((a, b) => b.count - a.count).slice(0, 6));

      setFunnel([
        { name: "Lead Magnets", value: magnets?.length ?? 0 },
        { name: "Brochures", value: brochures?.length ?? 0 },
        { name: "Counselling Leads", value: leads?.length ?? 0 },
        { name: "Applications", value: apps?.length ?? 0 },
      ]);
    })();
  }, []);

  const COLORS = ["#1043E9", "#F05A26", "#7C3AED", "#059669"];

  return (
    <div className="space-y-5">
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-display font-bold mb-3">Leads & Applications — Last 14 days</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="leads" stroke="#1043E9" strokeWidth={2} />
              <Line type="monotone" dataKey="apps" stroke="#F05A26" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-card border rounded-2xl p-5">
          <h3 className="font-display font-bold mb-3">Top colleges by applications</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={topColleges} layout="vertical">
                <XAxis type="number" fontSize={11} />
                <YAxis dataKey="name" type="category" width={120} fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#1043E9" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-5">
          <h3 className="font-display font-bold mb-3">Conversion funnel</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={funnel} dataKey="value" nameKey="name" outerRadius={80} label>
                  {funnel.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
