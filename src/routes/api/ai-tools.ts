import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

type ActionBody = {
  action: "recommend" | "essay" | "loan";
  payload: Record<string, unknown>;
};

const SYSTEMS: Record<ActionBody["action"], string> = {
  recommend:
    "You are an expert Indian MBA admissions counsellor. Given a student profile (CAT/percentile, budget, work-ex, city, goals), recommend 5 best-fit MBA programs from India (IIMs, ISB, XLRI, SPJIMR, MDI, IIFT, SIBM, NMIMS, GLIM, IMT, etc.). Return concise markdown with: a 1-line summary, then 5 colleges as `**Name** (City) — fees, avg package, fit reason`. End with one next-step CTA.",
  essay:
    "You are a top-tier MBA SOP / application essay reviewer. Score the essay 1–10 on Clarity, Storytelling, Specificity, Authenticity, Fit. Give 3 strengths and 3 concrete fixes with rewrite examples. Format strictly as markdown headings. Be candid, kind, specific.",
  loan:
    "You are an Indian education-loan eligibility expert. Given monthly income, co-applicant income, course fee, college tier, and credit profile, output: (1) Eligibility verdict (High/Medium/Low) + emoji, (2) Estimated max loan ₹, (3) Likely interest range %, (4) Top 3 recommended lenders (HDFC Credila, Avanse, Auxilo, ICICI, SBI) with 1-line why, (5) 3 actionable tips to improve approval odds. Use markdown.",
};

export const Route = createFileRoute("/api/ai-tools")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const { action, payload } = (await request.json()) as ActionBody;
          if (!action || !SYSTEMS[action]) return new Response("Bad action", { status: 400 });

          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-2.5-flash");

          const { text } = await generateText({
            model,
            system: SYSTEMS[action],
            prompt: JSON.stringify(payload).slice(0, 6000),
          });

          return Response.json({ result: text });
        } catch (e: any) {
          const msg = e?.message || "AI request failed";
          const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
          return new Response(msg, { status });
        }
      },
    },
  },
});
