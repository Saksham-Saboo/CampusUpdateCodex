import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — CampusUpdates" }] }),
  component: Contact,
});

function Contact() {
  return (
    <SiteShell>
      <div className="bg-card border-b">
        <div className="max-w-[1180px] mx-auto px-6 py-10">
          <h1 className="font-display text-3xl font-extrabold mb-2">Contact Us</h1>
          <p className="text-ink-3">Our team replies within 4 hours on business days</p>
        </div>
      </div>
      <div className="max-w-[1180px] mx-auto px-6 py-12 grid md:grid-cols-[1fr_2fr] gap-10">
        <div className="space-y-6">
          {[
            { I: Phone, t: "Phone", v: "+91 90000 00000" },
            { I: Mail, t: "Email", v: "hello@campusupdates.in" },
            { I: MapPin, t: "Office", v: "Bangalore, India" },
          ].map(({ I, t, v }) => (
            <div key={t} className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <I className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-ink-3">{t}</div>
                <div className="font-semibold">{v}</div>
              </div>
            </div>
          ))}
        </div>
        <form className="bg-card border rounded-2xl p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Thanks! We'll reply within 4 hours."); (e.target as HTMLFormElement).reset(); }}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-ink-2 block mb-1">Name *</label><input required className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary" /></div>
            <div><label className="text-xs font-semibold text-ink-2 block mb-1">Email *</label><input required type="email" className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary" /></div>
          </div>
          <div><label className="text-xs font-semibold text-ink-2 block mb-1">Subject</label><input className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary" /></div>
          <div><label className="text-xs font-semibold text-ink-2 block mb-1">Message *</label><textarea required rows={5} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary" /></div>
          <Button type="submit" size="lg" className="bg-primary">Send message</Button>
        </form>
      </div>
    </SiteShell>
  );
}
