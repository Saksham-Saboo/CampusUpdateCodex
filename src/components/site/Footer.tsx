import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface-dark text-surface-dark-foreground/80 mt-20">
      <div className="max-w-[1240px] mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <Logo light />
          <p className="text-sm mt-4 leading-relaxed">
            India's MBA-only discovery platform. Helping 1L+ students compare, choose & apply to the right college.
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Instagram, Linkedin, Youtube].map((I, i) => (
              <a key={i} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition cursor-pointer">
                <I className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-bold text-white mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/colleges" search={{ q: "" } as never}>All Colleges</Link></li>
            <li><Link to="/compare">Compare Tool</Link></li>
            <li><Link to="/counselling">Free Counselling</Link></li>
            <li><Link to="/blog">MBA Insights</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><a>Privacy Policy</a></li>
            <li><a>Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-white mb-4">Get in touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0" /> +91 90000 00000</li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0" /><span>hello@campusupdates.in</span></li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> Bangalore, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()} CampusUpdates. All rights reserved.
      </div>
    </footer>
  );
}
