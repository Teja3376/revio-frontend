import { z } from "zod";

export const DepthSchema = z.enum(["quick", "normal", "full"]);
export type Depth = z.infer<typeof DepthSchema>;

export const RepoSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  enabled: z.boolean(),
  depth: DepthSchema,
  ignoreGlobs: z.array(z.string()),
});
export type Repo = z.infer<typeof RepoSchema>;
export const RepoListSchema = z.object({ items: z.array(RepoSchema) });
export type RepoPatch = Partial<Pick<Repo, "enabled" | "depth" | "ignoreGlobs">>;

/** The ignore-pattern editor: one pattern per line, same limits as the API. */
export const IgnoreGlobsForm = z.object({
  patterns: z
    .string()
    .transform((s) =>
      s
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    )
    // Errors attach to the whole field so the form can show them under the textarea.
    .pipe(
      z.array(z.string()).superRefine((patterns, ctx) => {
        if (patterns.some((p) => p.length > 200)) {
          ctx.addIssue({ code: "custom", message: "Keep each pattern under 200 characters." });
        }
        if (patterns.length > 50)
          ctx.addIssue({ code: "custom", message: "Use at most 50 patterns." });
      }),
    ),
});
