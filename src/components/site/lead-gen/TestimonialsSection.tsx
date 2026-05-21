import { Star } from "lucide-react";

type T = {
  name: string;
  role: string;
  company: string;
  text: string;
  initials: string;
  bg: string;
  rating?: number;
};

const COUNSELLING: T[] = [
  {
    name: "Aditya Sharma",
    role: "Senior Analyst",
    company: "Deloitte",
    text: "My CampusUpdates counsellor shortlisted 5 colleges in 30 mins based on my CAT score and budget. Saved me 3 months of confusion — got into Christ University with scholarship.",
    initials: "AS", bg: "#1043E9", rating: 5,
  },
  {
    name: "Priya Mehta",
    role: "Brand Manager",
    company: "HUL",
    text: "The ROI calculator was a game-changer. Realised Symbiosis was worth the higher fees vs a cheaper option. Counsellor Neha was patient and never pushy.",
    initials: "PM", bg: "#7C3AED", rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Product Manager",
    company: "Flipkart",
    text: "As a working professional I needed weekend classes. The team found me an executive MBA in 2 calls. Whole admission was over WhatsApp — super smooth.",
    initials: "RV", bg: "#059669", rating: 5,
  },
];

const LOAN: T[] = [
  {
    name: "Sneha Joshi",
    role: "Consultant",
    company: "EY India",
    text: "Got ₹18L sanctioned at 9.4% in 6 days for my MBA at NMIMS. Tried 2 banks myself for a month with no luck. CampusUpdates' partner network is real.",
    initials: "SJ", bg: "#1043E9", rating: 5,
  },
  {
    name: "Karthik Reddy",
    role: "Software Engineer",
    company: "Infosys",
    text: "They helped me compare 4 loan offers side-by-side. Picked an NBFC with no collateral required — paperwork took less than a week.",
    initials: "KR", bg: "#F05A26", rating: 5,
  },
  {
    name: "Ritika Gupta",
    role: "Marketing Lead",
    company: "Swiggy",
    text: "Family income was modest so I was worried. Got a co-applicant loan structure that worked + tax benefit under 80E explained clearly. Trustworthy team.",
    initials: "RG", bg: "#7C3AED", rating: 5,
  },
];

function Card({ t }: { t: T }) {
  return (
    <div className="bg-card border rounded-2xl p-5 shadow-card hover:shadow-pop transition flex flex-col h-full">
      <div className="flex items-center gap-1 mb-3 text-warning">
        {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-current" />
        ))}
      </div>
      <p className="text-sm text-ink-2 leading-relaxed flex-1">"{t.text}"</p>
      <div className="flex items-center gap-3 pt-4 mt-4 border-t">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
          style={{ background: t.bg }}
        >
          {t.initials}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">{t.name}</div>
          <div className="text-[11.5px] text-ink-3 truncate">
            {t.role} · <span className="text-ink-2 font-medium">{t.company}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection({
  variant = "counselling",
  title,
}: {
  variant?: "counselling" | "loan";
  title?: string;
}) {
  const data = variant === "loan" ? LOAN : COUNSELLING;
  return (
    <section className="max-w-[1180px] mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 bg-success-soft text-success text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
          ⭐ 4.8 / 5 from 12,000+ students
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-bold">
          {title ?? (variant === "loan" ? "Loans they actually got" : "Students who found their MBA here")}
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {data.map((t) => <Card key={t.name} t={t} />)}
      </div>
    </section>
  );
}
