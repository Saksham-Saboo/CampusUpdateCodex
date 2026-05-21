import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — CampusUpdates" }] }),
  component: Auth,
});

const signupSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  password: z.string().min(8).max(72),
});

function Auth() {
  const { user, role } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [verifySent, setVerifySent] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    if (user) nav({ to: role === "admin" ? "/admin" : "/dashboard" });
  }, [user, role, nav]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries()) as any;
    setLoading(true);
    if (mode === "signup") {
      const parsed = signupSchema.safeParse(fd);
      if (!parsed.success) { setLoading(false); toast.error(parsed.error.issues[0].message); return; }
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: parsed.data.full_name, phone: parsed.data.phone } },
      });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      if (!data.session) {
        // Email confirmation required
        setPendingEmail(parsed.data.email);
        setVerifySent(true);
        toast.info("Check your inbox to verify your email");
      } else {
        toast.success("Account created! Welcome.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: fd.email, password: fd.password });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Welcome back!");
    }
  };

  const resendVerification = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: pendingEmail,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Verification email resent");
  };

  return (
    <SiteShell>
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-card border rounded-2xl p-8 shadow-card">
          {verifySent ? (
            <>
              <div className="text-5xl text-center mb-4">📧</div>
              <h1 className="font-display text-2xl font-extrabold mb-2 text-center">Check your email</h1>
              <p className="text-sm text-ink-3 mb-6 text-center">
                We sent a verification link to <span className="font-semibold text-ink-1">{pendingEmail}</span>. Click the link in the email to activate your account, then sign in.
              </p>
              <Button onClick={() => { setVerifySent(false); setMode("signin"); }} size="lg" className="w-full bg-primary">
                Back to sign in
              </Button>
              <p className="text-sm text-center text-ink-3 mt-4">
                Didn't get it?{" "}
                <button onClick={resendVerification} disabled={loading} className="text-primary font-semibold hover:underline">
                  Resend email
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-2xl font-extrabold mb-1">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
              <p className="text-sm text-ink-3 mb-6">{mode === "signin" ? "Sign in to track your applications" : "Save colleges & track applications in one place"}</p>
              <form onSubmit={submit} className="space-y-3">
                {mode === "signup" && (
                  <>
                    <Input name="full_name" label="Full name" required />
                    <Input name="phone" label="Phone" required placeholder="+91" />
                  </>
                )}
                <Input name="email" type="email" label="Email" required />
                <Input name="password" type="password" label="Password" required />
                <Button type="submit" disabled={loading} size="lg" className="w-full bg-primary mt-2">
                  {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>
              <p className="text-sm text-center text-ink-3 mt-5">
                {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
                <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-semibold hover:underline">
                  {mode === "signin" ? "Create account" : "Sign in"}
                </button>
              </p>
              <p className="text-xs text-center text-ink-3 mt-3">
                <Link to="/" className="hover:text-primary">← Back to home</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function Input({ name, label, type = "text", required, placeholder }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-ink-2 block mb-1">{label}{required && " *"}</label>
      <input name={name} type={type} required={required} placeholder={placeholder}
        className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary" />
    </div>
  );
}
