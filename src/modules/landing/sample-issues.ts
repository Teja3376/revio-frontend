// Example review used by the landing page samples. Same shape as @revio/types Issue.
export type SampleIssue = {
  file: string;
  line: number;
  severity: "error" | "warning" | "info";
  category: "bug" | "security" | "performance" | "quality" | "style";
  message: string;
  suggestion?: string;
};

export const SAMPLE_ISSUES: SampleIssue[] = [
  {
    file: "src/api/users.ts",
    line: 42,
    severity: "error",
    category: "security",
    message: "User input is passed to the SQL query unescaped.",
    suggestion: "Use a parameterized query.",
  },
  {
    file: "src/api/users.ts",
    line: 43,
    severity: "warning",
    category: "bug",
    message: "rows[0] is undefined when no user matches.",
    suggestion: "Return 404 before reading the row.",
  },
  {
    file: "src/lib/dates.ts",
    line: 7,
    severity: "info",
    category: "bug",
    message: "Uses the server's time zone, not the user's.",
  },
];
