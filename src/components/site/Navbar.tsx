import { Link, useLocation } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ArrowRight, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { DarkModeToggle } from "./DarkModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Primary nav (always visible)
const primary = [
  { to: "/colleges", label: "Colleges" },
  { to: "/compare", label: "Compare" },
  { to: "/tools", label: "Tools" },
  { to: "/counselling", label: "Counselling" },
];

// Grouped under "More"
const more = [
  { to: "/ai-tools", label: "AI Tools" },
  { to: "/loan", label: "Loan & EMI" },
  { to: "/news", label: "News" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { user, role, signOut } = useAuth();
  const loc = useLocation();
  const moreActive = more.some((l) => loc.pathname.startsWith(l.to));

  return (
    <nav className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center gap-5">
        <Logo />
        <div className="hidden lg:flex flex-1 max-w-md">
          <SearchAutocomplete />
        </div>
        <div className="hidden md:flex items-center gap-1 ml-auto">
          {primary.map((l) => {
            const active = loc.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to} to={l.to}
                className={`px-3 py-1.5 text-[13.5px] font-medium rounded-md transition ${
                  active ? "bg-primary-soft text-primary" : "text-ink-2 hover:bg-primary-soft hover:text-primary"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`px-3 py-1.5 text-[13.5px] font-medium rounded-md transition inline-flex items-center gap-1 ${
                  moreActive ? "bg-primary-soft text-primary" : "text-ink-2 hover:bg-primary-soft hover:text-primary"
                }`}
              >
                More <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {more.map((l) => (
                <DropdownMenuItem key={l.to} asChild>
                  <Link to={l.to} className="cursor-pointer">{l.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          {user ? (
            <>
              <Link to={role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="outline" size="sm" className="gap-1.5 border-[1.5px]">
                  <LayoutDashboard className="w-4 h-4" />
                  {role === "admin" ? "Admin" : "Dashboard"}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="gap-1.5">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-[1.5px] border-border text-ink-2 hover:border-primary hover:text-primary hover:bg-transparent">
                  Login
                </Button>
              </Link>
              <Link to="/counselling">
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1 shadow-[0_2px_8px_rgba(240,90,38,0.28)] hover:shadow-[0_4px_14px_rgba(240,90,38,0.36)] transition">
                  Get Free Advice <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
