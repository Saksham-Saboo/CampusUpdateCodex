import { Link } from "@tanstack/react-router";
import { Star, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface College {
  id: string;
  name: string;
  short_name: string | null;
  location: string;
  type: string | null;
  fees_min: number | null;
  fees_max: number | null;
  rating: number | null;
  logo_color: string | null;
  tags: string[] | null;
  apply_link: string | null;
  admission_open: boolean | null;
  image_url?: string | null;
}

// Curated, royalty-free campus imagery (Unsplash) used as deterministic fallbacks
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=800&q=80&auto=format&fit=crop",
];

function pickFallback(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return FALLBACK_IMAGES[h % FALLBACK_IMAGES.length];
}

const fmt = (n: number | null) => (n ? `₹${(n / 100000).toFixed(1)}L` : "—");

export function CollegeCard({ c, onSave, saved }: { c: College; onSave?: (id: string) => void; saved?: boolean }) {
  const initials = (c.short_name || c.name).slice(0, 3).toUpperCase();
  const accent = c.logo_color || "#1043E9";
  const heroImage = c.image_url || pickFallback(c.id);
  return (
    <div className="bg-card border rounded-2xl overflow-hidden hover:shadow-pop hover:-translate-y-1 transition-all duration-200 group">
      <div className="h-32 relative overflow-hidden">
        <img
          src={heroImage}
          alt={`${c.name} campus`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${accent}99 0%, ${accent}26 50%, rgba(0,0,0,0.45) 100%)` }}
        />
        {c.admission_open && (
          <span className="absolute top-2.5 left-2.5 bg-accent text-accent-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow">Admission Open</span>
        )}
        <div className="absolute top-2.5 right-2.5 bg-white/95 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow">
          <Star className="w-3 h-3 fill-warning text-warning" /> {c.rating?.toFixed(1) || "4.0"}
        </div>
        <div
          className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl bg-white border-2 border-white shadow flex items-center justify-center font-display font-extrabold text-sm"
          style={{ color: accent }}
        >
          {initials}
        </div>
      </div>
      <div className="pt-7 px-4 pb-4">
        <h3 className="font-display font-bold text-[15px] leading-tight mb-1 line-clamp-2">{c.name}</h3>
        <div className="text-xs text-ink-3 flex items-center gap-1 mb-2.5">
          <MapPin className="w-3 h-3" /> {c.location}
        </div>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {(c.tags || []).slice(0, 3).map((t) => (
            <span key={t} className="text-[10.5px] px-2 py-0.5 rounded bg-primary-soft text-primary font-medium">{t}</span>
          ))}
        </div>
        <div className="flex items-center justify-between mb-3 px-3 py-2 bg-muted rounded-lg">
          <div>
            <div className="text-[10.5px] text-ink-3">Total Fees</div>
            <div className="font-display font-bold text-sm">{fmt(c.fees_min)}{c.fees_max && c.fees_max !== c.fees_min ? ` – ${fmt(c.fees_max)}` : ""}</div>
          </div>
          {c.type && <span className="text-[10.5px] text-success font-semibold bg-success-soft px-2 py-1 rounded">{c.type}</span>}
        </div>
        <div className="flex gap-2">
          <Link to="/colleges/$id" params={{ id: c.id }} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs">View</Button>
          </Link>
          {c.apply_link ? (
            <a href={c.apply_link} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="sm" className="w-full text-xs bg-accent hover:bg-accent/90 text-accent-foreground">Apply</Button>
            </a>
          ) : (
            <Button size="sm" className="flex-1 text-xs" disabled>Coming soon</Button>
          )}
          {onSave && (
            <Button variant="ghost" size="sm" onClick={() => onSave(c.id)} className="px-2.5">
              <Heart className={`w-4 h-4 ${saved ? "fill-accent text-accent" : ""}`} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
