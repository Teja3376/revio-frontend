"use client";

import { ErrorPage, type ErrorPageProps } from "@/components/error-page";

export default function RootError(props: ErrorPageProps) {
  return (
    <main>
      <ErrorPage {...props} />
    </main>
  );
}
