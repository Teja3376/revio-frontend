"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

  return (
    <li className="grid gap-6 border-t border-border py-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
      <div className="flex items-start justify-between gap-4 lg:flex-col lg:justify-start">
        <h2 className="text-lg font-semibold text-text">{repo.fullName}</h2>
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <Switch
            checked={repo.enabled}
            onCheckedChange={(enabled) => update.mutate({ enabled })}
            aria-label={`Review pull requests in ${repo.fullName}`}
          />
          <span aria-hidden="true">{repo.enabled ? "Reviewing pull requests" : "Paused"}</span>
        </div>
        <p
          aria-live="polite"
          className={`text-sm ${update.isError ? "text-danger" : "text-text-muted"}`}
        >
          {status}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Field>
          <FieldLabel htmlFor={`depth-${repo.id}`}>Depth</FieldLabel>
          <Select
            items={DEPTHS}
            value={repo.depth}
            onValueChange={(depth) => depth && update.mutate({ depth: depth as Depth })}
          >
            <SelectTrigger id={`depth-${repo.id}`} aria-label="Depth" className="h-10 w-full">
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
          <FieldDescription>How deep pull request reviews go.</FieldDescription>
        </Field>

        <form onSubmit={savePatterns} noValidate>
          <Controller
            name="patterns"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`ignore-${repo.id}`}>Ignore patterns</FieldLabel>
                <Textarea
                  {...field}
                  id={`ignore-${repo.id}`}
                  rows={3}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  One pattern per line. Matching files are never reviewed.
                </FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Button type="submit" variant="outline" className="mt-3" disabled={update.isPending}>
            Save patterns
          </Button>
        </form>
      </div>
    </li>
  );
}
