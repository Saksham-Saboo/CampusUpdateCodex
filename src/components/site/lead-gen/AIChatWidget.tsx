import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, Loader2, Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const SUGGESTIONS = [
  "Top MBA colleges under ₹10L?",
  "Compare ISB vs IIM-A ROI",
  "Best online MBA in India 2026",
  "Education loan options for MBA",
];

export function AIChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="AI Counsellor"
        className="fixed bottom-24 right-5 z-[59] w-14 h-14 rounded-full bg-gradient-to-br from-[#1043E9] to-[#7C3AED] text-white shadow-[0_10px_30px_rgba(16,67,233,0.45)] flex items-center justify-center hover:scale-105 active:scale-95 transition"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">AI</span>
      </button>

      {open && (
        <div className="fixed bottom-5 right-5 z-[65] w-[360px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-2rem)] bg-card rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-gradient-to-br from-[#1043E9] to-[#7C3AED] text-white px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">MBA AI Counsellor</div>
              <div className="text-[11px] opacity-90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" /> Powered by Lovable AI
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="opacity-80 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          {!user ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <Bot className="w-12 h-12 text-primary mb-3" />
              <h3 className="font-display font-bold text-base mb-1">Login to chat with AI</h3>
              <p className="text-xs text-ink-3 mb-4">Get personalised MBA advice instantly. Your chat history is saved across visits.</p>
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                Login / Sign up
              </Link>
            </div>
          ) : (
            <ChatPanel userId={user.id} onClose={() => setOpen(false)} />
          )}
        </div>
      )}
    </>
  );
}

function ChatPanel({ userId }: { userId: string; onClose: () => void }) {
  const [initial, setInitial] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any)
        .from("chat_messages")
        .select("id, role, content, created_at")
        .order("created_at", { ascending: true })
        .limit(200);
      if (cancelled) return;
      const ui: UIMessage[] = (data ?? [])
        .filter((m: any) => m.role === "user" || m.role === "assistant")
        .map((m: any) => ({
          id: m.id,
          role: m.role,
          parts: [{ type: "text", text: m.content }],
        }));
      setInitial(ui);
    })();
    return () => { cancelled = true; };
  }, [userId]);

  if (initial === null) {
    return (
      <div className="flex-1 flex items-center justify-center text-ink-3">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }
  return <ChatLive userId={userId} initial={initial} />;
}

function ChatLive({ userId, initial }: { userId: string; initial: UIMessage[] }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = new DefaultChatTransport({
    api: "/api/chat",
    fetch: async (url, init) => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      const headers = new Headers(init?.headers);
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return fetch(url, { ...init, headers });
    },
  });

  const { messages, sendMessage, status } = useChat({
    id: userId,
    messages: initial,
    transport,
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const busy = status === "submitted" || status === "streaming";

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
  };

  const quickAsk = async (q: string) => {
    if (busy) return;
    await sendMessage({ text: q });
  };

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-muted/30">
        {messages.length === 0 && (
          <div>
            <div className="text-sm text-ink-2 mb-3">
              👋 Hi! I'm your AI MBA counsellor. Ask me anything about colleges, fees, CAT scores, loans, or career outcomes.
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => quickAsk(s)}
                  className="text-left text-xs px-3 py-2 bg-card border rounded-lg hover:border-primary hover:text-primary transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => {
          const text = (m.parts ?? [])
            .map((p: any) => (p?.type === "text" ? p.text : ""))
            .join("");
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              {isUser ? (
                <div className="max-w-[85%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3.5 py-2 text-sm shadow-sm whitespace-pre-wrap">
                  {text}
                </div>
              ) : (
                <div className="max-w-[90%] text-sm text-ink prose prose-sm prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0 prose-headings:my-2 max-w-none">
                  <ReactMarkdown>{text}</ReactMarkdown>
                </div>
              )}
            </div>
          );
        })}
        {status === "submitted" && (
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <Loader2 className="w-3 h-3 animate-spin" /> Thinking…
          </div>
        )}
      </div>

      <form onSubmit={submit} className="border-t bg-card p-2.5 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Ask about MBA colleges, fees, loans…"
          className="flex-1 resize-none px-3 py-2 text-sm bg-muted/40 border rounded-lg outline-none focus:border-primary max-h-28"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:opacity-90"
          aria-label="Send"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </>
  );
}
