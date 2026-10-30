"use server";

import { createAdminSupabase } from "@/lib/supabase/admin";
import { ContactSchema, type ContactState, type ContactValues } from "./schema";

const FAILED = "Couldn’t send your message. Try again in a minute.";
const RATE_LIMITED = "Too many messages right now. Try again in an hour.";

export async function sendMessage(_prev: ContactState, data: FormData): Promise<ContactState> {
  // Hidden field only bots fill in: pretend it worked, save nothing.
  if (String(data.get("hp_extra") ?? "")) return { status: "sent" };

  const values: ContactValues = {
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
    topic: String(data.get("topic") ?? ""),
    message: String(data.get("message") ?? ""),
  };
  const parsed = ContactSchema.safeParse(values);
  if (!parsed.success) {
    const errors: Partial<Record<keyof ContactValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactValues;
      errors[key] ??= issue.message;
    }
    return { status: "invalid", errors, values };
  }

  try {
    // Inserts go through the server with the secret key; the table has no public policies.
    const { error } = await createAdminSupabase().from("contact_messages").insert(parsed.data);
    if (error) {
      console.error("contact_messages insert failed:", error.message);
      const limited = error.message.includes("rate_limited");
      return { status: "error", message: limited ? RATE_LIMITED : FAILED, values };
    }
  } catch (e) {
    console.error("contact_messages insert failed:", e);
    return { status: "error", message: FAILED, values };
  }
  return { status: "sent" };
}
