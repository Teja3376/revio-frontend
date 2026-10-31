/**
 * Sample mode: local development with no API configured. Never in production, so sample
 * data can't ship. The dashboard shows a "Sample data" badge while it's on.
 */
export const SAMPLE_MODE =
  process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL;
