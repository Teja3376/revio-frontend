"use server";

import { createAdminSupabase } from "@/lib/supabase/admin";
import { type ContactField, type ContactResult, ContactSchema } from "./schema";

const FAILED = "Couldn’t send your message. Try again in a minute.";
const RATE_LIMITED = "Too many messages right now. Try again in an hour.";

/** Called from the Connect form. Validates again on the server: never trust the browser. */
export async function sendMessage(input: unknown): Promise<ContactResult> {
  const raw = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};

  // Hidden field only bots fill in: pretend it worked, save nothing.
  if (typeof raw.hp_extra === "string" && raw.hp_extra) return { status: "sent" };

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField;
      errors[key] ??= issue.message;
    }
    return { status: "invalid", errors };
  }

  try {
    // Inserts go through the server with the secret key; the table has no public policies.
    const { error } = await createAdminSupabase().from("contact_messages").insert(parsed.data);
    if (error) {
      console.error("contact_messages insert failed:", error.message);
      return {
        status: "error",
        message: error.message.includes("rate_limited") ? RATE_LIMITED : FAILED,
      };
    }
  } catch (e) {
    console.error("contact_messages insert failed:", e);
    return { status: "error", message: FAILED };
  }
  return { status: "sent" };
}
