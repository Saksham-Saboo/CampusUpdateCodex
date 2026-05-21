import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Target, Heart, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — CampusUpdates" }, { name: "description", content: "India's MBA-only discovery platform. Our mission, team, and values." }] }),
  component: About,
});

function About() {
  return (
    <SiteShell>
      <section className="gradient-hero">
        <div className="max-w-[1180px] mx-auto px-6 py-16 text-white text-center">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">India's MBA-Only Discovery Platform</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">We help 1L+ aspirants every year compare, choose, and apply to the right MBA — without bias, without spam, and without fees.</p>
        </div>
      </section>
      <div className="max-w-[1180px] mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {[
          { I: Target, t: "Our Mission", d: "Make MBA discovery transparent, data-driven, and personal — for every Indian student, regardless of background." },
          { I: Heart, t: "Our Values", d: "Honesty over hype. Verified data over marketing fluff. Student outcomes over commissions." },
          { I: Lightbulb, t: "Our Approach", d: "We combine 50,000+ alumni data points with industry-trained counsellors to match you to colleges where you'll actually thrive." },
        ].map(({ I, t, d }) => (
          <div key={t} className="bg-card border rounded-2xl p-7">
            <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4">
              <I className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">{t}</h3>
            <p className="text-sm text-ink-2 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </SiteShell>
  );
}
