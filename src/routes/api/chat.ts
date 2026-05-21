import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `You are CampusUpdates AI — a friendly, expert MBA admissions counsellor for Indian students.

You help with:
- Recommending MBA colleges based on profile, budget, location, and goals (IIMs, ISB, XLRI, SIBM, NMIMS, etc.)
- Explaining CAT / XAT / GMAT / NMAT / SNAP cutoffs and eligibility
- Comparing colleges on fees, placements, ROI, and specialisations
- Education loan guidance (HDFC Credila, Avanse, Auxilo, ICICI, SBI)
- Online MBA, Executive MBA, and Distance MBA options
- SOP tips, interview prep, and application timelines

Style: warm, concise, structured (use bullet points + short paragraphs). Always end with a helpful follow-up question OR suggest the user book free counselling via the form on /counselling or WhatsApp +91 84358 68053. Use ₹ for currency. If asked something outside MBA admissions, gently redirect.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }
        const token = authHeader.slice(7);

        const supabaseUrl = process.env.SUPABASE_URL!;
        const supabasePublishable = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const authedClient = createClient(supabaseUrl, supabasePublishable, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: userData, error: userErr } = await authedClient.auth.getUser();
        if (userErr || !userData.user) {
          return new Response("Unauthorized", { status: 401 });
        }
        const userId = userData.user.id;

        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages required", { status: 400 });
        }
        const uiMessages = messages as UIMessage[];

        const lastUser = [...uiMessages].reverse().find((m) => m.role === "user");
        if (lastUser) {
          const text = (lastUser.parts ?? [])
            .map((p: any) => (p?.type === "text" ? p.text : ""))
            .join("")
            .trim();
          if (text) {
            await (authedClient as any).from("chat_messages").insert({
              user_id: userId,
              role: "user",
              content: text,
            });
          }
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(uiMessages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: uiMessages,
          onFinish: async ({ responseMessage }) => {
            const text = (responseMessage.parts ?? [])
              .map((p: any) => (p?.type === "text" ? p.text : ""))
              .join("")
              .trim();
            if (text) {
              await (authedClient as any).from("chat_messages").insert({
                user_id: userId,
                role: "assistant",
                content: text,
              });
            }
          },
        });
      },
    },
  },
});
