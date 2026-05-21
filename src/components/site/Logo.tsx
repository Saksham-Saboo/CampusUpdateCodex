import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 whitespace-nowrap" aria-label="CampusUpdates home">
      <img
        src={logo}
        alt="CampusUpdates"
        className={`h-9 w-auto ${light ? "brightness-0 invert" : "[filter:brightness(0)_saturate(100%)_invert(19%)_sepia(95%)_saturate(3500%)_hue-rotate(225deg)_brightness(95%)_contrast(95%)]"}`}
      />
    </Link>
  );
}
