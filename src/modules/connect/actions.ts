"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { ContactSchema, type ContactState, type ContactValues } from "./schema";

const FAILED = "Couldn’t send your message. Try again in a minute.";

export async function sendMessage(_prev: ContactState, data: FormData): Promise<ContactState> {
  // Hidden field only bots fill in: pretend it worked, save nothing.
  if (String(data.get("website") ?? "")) return { status: "sent" };

  const values: ContactValues = {
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? "").trim(),
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
    const supabase = await createServerSupabase();
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    if (error) return { status: "error", message: FAILED, values };
  } catch {
    return { status: "error", message: FAILED, values };
  }
  return { status: "sent" };
}
