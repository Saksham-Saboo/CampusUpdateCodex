import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { RouteProgress } from "@/components/site/RouteProgress";
import appCss from "../styles.css?url";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-display text-7xl font-extrabold text-primary">404</h1>
        <p className="mt-3 text-ink-2">This page took a gap year.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium">Back home</Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CampusUpdates — Find Your MBA. Fast." },
      { name: "description", content: "India's MBA-only discovery platform. Compare colleges, calculate ROI for MBA, and apply with expert counselling , Best MBA Curseollege , MBA Online co" },
      { property: "og:title", content: "CampusUpdates — Find Your MBA. Fast." },
      { property: "og:description", content: "India's MBA-only discovery platform. Compare colleges, calculate ROI for MBA, and apply with expert counselling , Best MBA Curseollege , MBA Online co" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "CampusUpdates — Find Your MBA. Fast." },
      { name: "twitter:description", content: "India's MBA-only discovery platform. Compare colleges, calculate ROI for MBA, and apply with expert counselling , Best MBA Curseollege , MBA Online co" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b6439ba6-2f52-4872-aa26-d4ef97426813/id-preview-4a35a428--d3051e10-2f7f-4bb3-a273-627734b20bf8.lovable.app-1776924703205.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b6439ba6-2f52-4872-aa26-d4ef97426813/id-preview-4a35a428--d3051e10-2f7f-4bb3-a273-627734b20bf8.lovable.app-1776924703205.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
      { children: "if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})})}" },
      { children: "try{var t=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&p))document.documentElement.classList.add('dark')}catch(e){}" },
    ],
  }),
  shellComponent: RootShell,
  component: () => (
    <AuthProvider>
      <RouteProgress />
      <Outlet />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  ),
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}
