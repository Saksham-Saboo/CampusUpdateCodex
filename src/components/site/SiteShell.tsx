import type { ReactNode } from "react";
import { Topbar } from "./Topbar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./lead-gen/WhatsAppFloat";
import { AIChatWidget } from "./lead-gen/AIChatWidget";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <AIChatWidget />
    </div>
  );
}
