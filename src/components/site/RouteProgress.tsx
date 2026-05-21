import { useRouterState } from "@tanstack/react-router";

export function RouteProgress() {
  const isLoading = useRouterState({ select: (s) => s.isLoading });

  return (
    <div
      aria-hidden
      className={`fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none transition-opacity duration-200 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`h-full bg-gradient-to-r from-[#1043E9] via-[#7C3AED] to-[#F05A26] shadow-[0_0_8px_rgba(16,67,233,0.6)] ${
          isLoading ? "animate-[routeProgress_1.4s_ease-in-out_infinite]" : ""
        }`}
        style={{ width: "40%" }}
      />
      <style>{`
        @keyframes routeProgress {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(80%); }
          100% { transform: translateX(260%); }
        }
      `}</style>
    </div>
  );
}
