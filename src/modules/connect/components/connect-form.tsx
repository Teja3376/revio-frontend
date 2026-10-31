"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, useTransition } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "../actions";
import { type ContactField, type ContactInput, ContactSchema, TOPICS } from "../schema";

const FIELDS: ContactField[] = ["name", "email", "topic", "message"];

type FormValues = ContactInput & { hp_extra: string };

// The schema strips hp_extra; the submit handler adds it back so the server can spot bots.
const resolver = zodResolver(ContactSchema) as unknown as Resolver<FormValues>;

export function ConnectForm() {
  const form = useForm<FormValues>({
    resolver,
    defaultValues: { name: "", email: "", topic: "feedback", message: "", hp_extra: "" },
  });
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const thanksRef = useRef<HTMLParagraphElement>(null);

  // Focus the thanks message so screen-reader users hear that it worked.
  useEffect(() => {
    if (sent) thanksRef.current?.focus();
  }, [sent]);

  const onSubmit = form.handleSubmit((values) => {
    setFailure(null);
    startTransition(async () => {
      const result = await sendMessage({ ...values, hp_extra: form.getValues("hp_extra") });
      if (result.status === "sent") return setSent(true);
      if (result.status === "error") return setFailure(result.message);
      const first = FIELDS.find((f) => result.errors[f]);
      for (const f of FIELDS) {
        const message = result.errors[f];
        if (message) form.setError(f, { message }, { shouldFocus: f === first });
      }
    });
  });

  if (sent) {
    return (
      <p
        ref={thanksRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border border-border bg-surface p-6 text-text"
      >
        Thanks, your message is in. I’ll reply by email.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup className="grid gap-5 sm:grid-cols-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                autoComplete="name"
                required
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </FieldGroup>

      <Controller
        name="topic"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="topic">Topic</FieldLabel>
            <Select
              items={TOPICS}
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger
                id="topic"
                ref={field.ref}
                aria-label="Topic"
                aria-invalid={fieldState.invalid}
                onBlur={field.onBlur}
                className="h-11 w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TOPICS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        name="message"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <Textarea {...field} id="message" rows={6} required aria-invalid={fieldState.invalid} />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Honeypot: hidden from people and screen readers, filled only by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="hp_extra">Leave this empty</label>
        <input id="hp_extra" tabIndex={-1} autoComplete="off" {...form.register("hp_extra")} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="xl" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </Button>
        <p aria-live="polite" className="text-sm text-danger">
          {failure}
        </p>
      </div>
    </form>
  );
}
