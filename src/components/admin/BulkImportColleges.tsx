import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SAMPLE = `name,short_name,location,type,degree,fees_min,fees_max,duration,rating,placement_avg,placement_high,cat_cutoff,placement_pct,hostel,scholarship,admission_open,featured,sponsored,apply_link,description
IIM Ahmedabad,IIMA,Ahmedabad,Full-time MBA,MBA,2500000,2500000,2 years,4.9,3400000,11500000,99.5,100,true,true,true,true,false,https://iima.ac.in,Premier B-school`;

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const out: Record<string, string> = {};
    // very simple CSV split (no quoted commas) — fine for the template above
    const cells = line.split(",");
    headers.forEach((h, i) => { out[h] = (cells[i] ?? "").trim(); });
    return out;
  });
}

function coerce(row: Record<string, string>) {
  const num = (k: string) => row[k] ? Number(row[k]) : null;
  const bool = (k: string) => row[k] ? ["true", "yes", "1"].includes(row[k].toLowerCase()) : false;
  return {
    name: row.name, short_name: row.short_name || null, location: row.location,
    type: row.type || null, degree: row.degree || null, description: row.description || null,
    fees_min: num("fees_min"), fees_max: num("fees_max"), duration: row.duration || null,
    rating: num("rating") ?? 4.0, placement_avg: num("placement_avg"), placement_high: num("placement_high"),
    cat_cutoff: num("cat_cutoff"), placement_pct: num("placement_pct"),
    hostel: bool("hostel"), scholarship: bool("scholarship"),
    admission_open: row.admission_open ? bool("admission_open") : true,
    featured: bool("featured"), sponsored: bool("sponsored"),
    apply_link: row.apply_link || null,
  };
}

export function BulkImportColleges({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState(false);

  const importFile = async (file: File) => {
    setBusy(true);
    try {
      const text = await file.text();
      const rows = parseCsv(text).filter((r) => r.name && r.location).map(coerce);
      if (!rows.length) { toast.error("No valid rows found"); setBusy(false); return; }
      const { error } = await supabase.from("colleges").insert(rows as any);
      if (error) toast.error(error.message);
      else { toast.success(`Imported ${rows.length} colleges`); onDone(); }
    } catch (e: any) { toast.error(e.message); }
    setBusy(false);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "colleges-sample.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={downloadSample} className="gap-1.5">
        <Download className="w-4 h-4" /> Sample CSV
      </Button>
      <label className="inline-flex">
        <input
          type="file" accept=".csv" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.currentTarget.value = ""; }}
        />
        <span className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border-[1.5px] cursor-pointer ${busy ? "opacity-60" : "hover:bg-primary-soft hover:border-primary hover:text-primary"}`}>
          <Upload className="w-4 h-4" /> {busy ? "Importing…" : "Bulk import CSV"}
        </span>
      </label>
    </div>
  );
}
