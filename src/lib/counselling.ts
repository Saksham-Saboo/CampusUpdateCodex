import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

const COUNSELLING_SUBMISSION_LIMIT = 3;
const COUNSELLING_SUBMISSION_WINDOW_MS = 60 * 60 * 1000;
type CounsellingLeadInput = z.infer<typeof counsellingLeadSchema>;

export const counsellingLeadSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[+()\-\d\s]+$/, "Phone number contains invalid characters"),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  degree: z.string().trim().max(40).optional().or(z.literal("")),
  budget: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

const counsellingRateLimit = createMiddleware({ type: "function" }).server(async ({ next, data }) => {
  const ip = getRequestIP({ xForwardedFor: true }) || "unknown";
  const windowStart = new Date(Date.now() - COUNSELLING_SUBMISSION_WINDOW_MS).toISOString();
  const formData = (data ?? {}) as Partial<CounsellingLeadInput>;

  const normalizedEmail = typeof formData.email === "string" ? formData.email.trim().toLowerCase() : "";
  const normalizedPhone = typeof formData.phone === "string" ? formData.phone.replace(/\D/g, "") : "";

  const emailQuery = normalizedEmail
    ? supabaseAdmin
        .from("counselling_leads")
        .select("id", { count: "exact", head: true })
        .ilike("email", normalizedEmail)
        .gte("created_at", windowStart)
    : Promise.resolve({ count: 0, error: null });

  const phoneQuery = normalizedPhone
    ? supabaseAdmin
        .from("counselling_leads")
        .select("id", { count: "exact", head: true })
        .gte("created_at", windowStart)
        .eq("phone", formData.phone?.trim() ?? "")
    : Promise.resolve({ count: 0, error: null });

  const [{ count: emailCount, error: emailError }, { count: phoneCount, error: phoneError }] = await Promise.all([
    emailQuery,
    phoneQuery,
  ]);

  if (emailError || phoneError) {
    throw new Error("We could not verify your request right now. Please try again.");
  }

  if (Math.max(emailCount ?? 0, phoneCount ?? 0) >= COUNSELLING_SUBMISSION_LIMIT) {
    throw new Error("Too many requests. Please wait a while before submitting again.");
  }

  return next();
});

export const submitCounsellingLead = createServerFn({ method: "POST" })
  .middleware([counsellingRateLimit])
  .inputValidator(counsellingLeadSchema)
  .handler(async ({ data }) => {
    const payload = {
      ...data,
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      status: "new",
    };

    const { error } = await supabaseAdmin.from("counselling_leads").insert(payload);

    if (error) {
      throw new Error("We could not submit your request right now. Please try again.");
    }

    return { success: true };
  });