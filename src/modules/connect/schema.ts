import { z } from "zod";

export const TOPICS = [
  { value: "feedback", label: "Feedback" },
  { value: "bug", label: "Report a bug" },
  { value: "collaborate", label: "Collaborate" },
  { value: "hire", label: "Hire me" },
] as const;

// Same limits as the contact_messages table checks in supabase/migrations.
export const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Tell me your name." })
    .max(100, { error: "Keep the name under 100 characters." }),
  email: z
    .string()
    .trim()
    .pipe(
      z
        .email({ error: "Enter a valid email." })
        .max(200, { error: "Keep the email under 200 characters." }),
    ),
  topic: z.enum(["feedback", "bug", "collaborate", "hire"], { error: "Pick a topic." }),
  message: z
    .string()
    .trim()
    .min(10, { error: "Write at least 10 characters." })
    .max(2000, { error: "Keep it under 2,000 characters." }),
});

export type ContactInput = z.input<typeof ContactSchema>;
export type ContactField = keyof ContactInput;

export type ContactResult =
  | { status: "sent" }
  | { status: "invalid"; errors: Partial<Record<ContactField, string>> }
  | { status: "error"; message: string };
