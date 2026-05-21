import { useEffect, useState } from "react";
import { TrendingUp, Users, CheckCircle2 } from "lucide-react";

// Names anonymised to initials + city for privacy/believability.
const APPLICANTS = [
  ["Ananya S.", "Mumbai", "Symbiosis SCMHRD"],
  ["Rahul V.", "Delhi", "MDI Gurgaon"],
  ["Priya M.", "Bangalore", "Christ University"],
  ["Karan J.", "Pune", "SIBM Pune"],
  ["Neha R.", "Hyderabad", "ISB Hyderabad"],
  ["Aditya K.", "Lucknow", "IIM Lucknow"],
  ["Sneha P.", "Chennai", "Great Lakes"],
  ["Vikas T.", "Jaipur", "IIM Udaipur"],
  ["Ritika G.", "Indore", "IIM Indore"],
  ["Mohit A.", "Kolkata", "XLRI Jamshedpur"],
  ["Pooja D.", "Kochi", "IIM Kozhikode"],
  ["Sahil B.", "Noida", "IMT Ghaziabad"],
];

function counsellingThisMonth() {
  // Deterministic but believable number that climbs through the month.
  const now = new Date();
  const dayOfMonth = now.getDate();
  const base = 1820;
  const perDay = 36;
  const jitter = (now.getHours() * 7 + now.getMinutes()) % 11;
  return base + dayOfMonth * perDay + jitter;
}

export function SocialProofStrip() {
  // Start with a stable SSR-safe value to avoid hydration mismatch,
  // then hydrate the real number + start tickers on the client.
  const [count, setCount] = useState(2400);
  const [idx, setIdx] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCount(counsellingThisMonth());
    setHydrated(true);
    const c = setInterval(() => setCount((n) => n + (Math.random() < 0.35 ? 1 : 0)), 4000);
    const a = setInterval(() => setIdx((i) => (i + 1) % APPLICANTS.length), 3500);
    return () => {
      clearInterval(c);
      clearInterval(a);
    };
  }, []);

  const [n, city, college] = APPLICANTS[idx];
  void hydrated;

  return (
    <div className="bg-card border-y">
      <div className="max-w-[1180px] mx-auto px-6 py-3 flex flex-col md:flex-row items-center gap-3 md:gap-6 text-sm">
        <div className="flex items-center gap-2 text-ink-2 font-medium">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-70" />
            <span className="relative rounded-full w-2 h-2 bg-success" />
          </span>
          <Users className="w-4 h-4 text-success" />
          <span className="font-display font-bold text-ink">
            {count.toLocaleString("en-IN")}
          </span>{" "}
          students got counselling this month
        </div>

        <div className="hidden md:block w-px h-5 bg-border" />

        <div className="flex items-center gap-2 text-ink-2 overflow-hidden">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs md:text-sm truncate">
            <b>{n}</b> from {city} just applied to <b>{college}</b>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 ml-auto text-xs text-ink-3">
          <TrendingUp className="w-3.5 h-3.5 text-accent" />
          <span>Trending: Direct admission open</span>
        </div>
      </div>
    </div>
  );
}
