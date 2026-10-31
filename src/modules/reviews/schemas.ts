import { z } from "zod";

export const StatusSchema = z.enum(["queued", "running", "done", "failed", "skipped"]);
export type ReviewStatus = z.infer<typeof StatusSchema>;

export const ReviewSummarySchema = z.object({
  id: z.string(),
  repoId: z.string(),
  repoFullName: z.string(),
  prNumber: z.number().int(),
  prTitle: z.string(),
  prUrl: z.url(),
  status: StatusSchema,
  issueCount: z.number().int(),
  startedAt: z.string(),
  finishedAt: z.string().nullable(),
});
export type ReviewSummary = z.infer<typeof ReviewSummarySchema>;

export const ReviewListSchema = z.object({
  items: z.array(ReviewSummarySchema),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
});

export const IssueSchema = z.object({
  id: z.string(),
  file: z.string(),
  line: z.number().int(),
  endLine: z.number().int().optional(),
  severity: z.enum(["error", "warning", "info"]),
  category: z.enum(["bug", "security", "performance", "quality", "style"]),
  message: z.string(),
  suggestion: z.string().optional(),
});
export type Issue = z.infer<typeof IssueSchema>;

export const ReviewDetailSchema = ReviewSummarySchema.extend({
  summary: z.string().nullable(),
  risk: z.enum(["low", "medium", "high"]).nullable(),
  error: z.string().nullable(),
  issues: z.array(IssueSchema),
});
export type ReviewDetail = z.infer<typeof ReviewDetailSchema>;
