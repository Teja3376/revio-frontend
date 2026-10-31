"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateRepo } from "../api/queries";
import { type Depth, IgnoreGlobsForm, type Repo } from "../schemas";

const DEPTHS: { value: Depth; label: string }[] = [
  { value: "quick", label: "Quick: bugs, security" },
  { value: "normal", label: "Normal: + performance, quality" },
  { value: "full", label: "Full: + style, summary, risk" },
];

type PatternsForm = { patterns: string };
const resolver = zodResolver(IgnoreGlobsForm) as unknown as Resolver<PatternsForm>;

export function RepoRow({ repo }: { repo: Repo }) {
  const update = useUpdateRepo(repo.id);
  const [open, setOpen] = useState(false);
  const form = useForm<PatternsForm>({
    resolver,
    defaultValues: { patterns: repo.ignoreGlobs.join("\n") },
  });

  const savePatterns = form.handleSubmit((values) => {
    const ignoreGlobs = (values as unknown as { patterns: string[] }).patterns;
    update.mutate(
      { ignoreGlobs },
      { onSuccess: () => form.reset({ patterns: ignoreGlobs.join("\n") }) },
    );
  });

  const status = update.isPending
    ? "Saving…"
    : update.isError
      ? `Couldn’t save: ${update.error.message}`
      : update.isSuccess
        ? "Saved"
        : "";

  const count = repo.ignoreGlobs.length;
  const editorId = `ignore-editor-${repo.id}`;

  return (
    <li className="border-b border-border">
      <div className="flex min-h-11 flex-wrap items-center gap-x-4 gap-y-2 px-2 py-1.5 hover:bg-surface/40">
        <Switch
          checked={repo.enabled}
          onCheckedChange={(enabled) => update.mutate({ enabled })}
          aria-label={`Review pull requests in ${repo.fullName}`}
        />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h2
            className={`truncate text-[13px] font-medium ${repo.enabled ? "text-text" : "text-text-muted"}`}
          >
            {repo.fullName}
          </h2>
          {repo.enabled ? null : (
            <span aria-hidden="true" className="text-xs text-text-muted">
              Paused
            </span>
          )}
          <p
            aria-live="polite"
            className={`truncate text-xs ${update.isError ? "text-danger" : "text-text-muted"}`}
          >
            {status}
          </p>
        </div>
        <Select
          items={DEPTHS}
          value={repo.depth}
          onValueChange={(depth) => depth && update.mutate({ depth: depth as Depth })}
        >
          <SelectTrigger size="sm" aria-label="Depth" className="w-60 text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DEPTHS.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={editorId}
          onClick={() => setOpen((o) => !o)}
          className="w-36 rounded-md px-2 py-1 text-left text-[13px] text-text-muted tabular-nums hover:bg-surface hover:text-text focus-visible:outline-2 focus-visible:outline-ring"
        >
          {count === 0 ? "No ignore patterns" : `${count} ignore pattern${count === 1 ? "" : "s"}`}
        </button>
      </div>

      {open ? (
        <form
          id={editorId}
          onSubmit={savePatterns}
          noValidate
          className="flex max-w-xl flex-col gap-2 px-2 pt-1 pb-4 sm:pl-14"
        >
          <Controller
            name="patterns"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`ignore-${repo.id}`} className="text-[13px]">
                  Ignore patterns
                </FieldLabel>
                <Textarea
                  {...field}
                  id={`ignore-${repo.id}`}
                  rows={3}
                  aria-invalid={fieldState.invalid}
                  className="text-[13px]"
                />
                <FieldDescription className="text-xs">
                  One pattern per line. Matching files are never reviewed.
                </FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="self-start"
            disabled={update.isPending}
          >
            Save patterns
          </Button>
        </form>
      ) : null}
    </li>
  );
}
