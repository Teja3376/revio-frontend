"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { sendMessage } from "../actions";
import { type ContactState, type ContactValues, TOPICS } from "../schema";

const field =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-text placeholder:text-dim_grey-600 aria-[invalid=true]:border-danger";

export function ConnectForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, {
    status: "idle",
  });

  const formRef = useRef<HTMLFormElement>(null);
  const thanksRef = useRef<HTMLParagraphElement>(null);

  // Move focus so screen-reader users hear what happened.
  useEffect(() => {
    if (state.status === "sent") thanksRef.current?.focus();
    if (state.status === "invalid") {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [state]);

  if (state.status === "sent") {
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

  const errors = state.status === "invalid" ? state.errors : {};
  const values: Partial<ContactValues> =
    state.status === "invalid" || state.status === "error" ? (state.values ?? {}) : {};

  const describe = (name: keyof ContactValues) =>
    errors[name] ? { "aria-invalid": true, "aria-describedby": `${name}-error` } : {};

  const errorText = (name: keyof ContactValues) =>
    errors[name] ? (
      <p id={`${name}-error`} className="text-sm text-danger">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-text">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            defaultValue={values.name}
            className={field}
            {...describe("name")}
          />
          {errorText("name")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-text">
            Email
          </label>
          <input
            id="email"
            name="email"
            required
            type="email"
            autoComplete="email"
            defaultValue={values.email}
            className={field}
            {...describe("email")}
          />
          {errorText("email")}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="topic" className="text-sm text-text">
          Topic
        </label>
        <select
          id="topic"
          name="topic"
          defaultValue={values.topic ?? "feedback"}
          className={field}
          {...describe("topic")}
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errorText("topic")}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm text-text">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          defaultValue={values.message}
          className={field}
          {...describe("message")}
        />
        {errorText("message")}
      </div>
      {/* Honeypot: hidden from people and screen readers, filled only by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="hp_extra">Leave this empty</label>
        <input id="hp_extra" name="hp_extra" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="xl" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </Button>
        <p aria-live="polite" className="text-sm text-danger">
          {state.status === "error" ? state.message : null}
        </p>
      </div>
    </form>
  );
}
