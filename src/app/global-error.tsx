"use client";

import "./globals.css";
import { ErrorPage, type ErrorPageProps } from "@/components/error-page";

// Replaces the root layout when it crashes, so it brings its own <html> and <body>.
export default function GlobalError(props: ErrorPageProps) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg font-sans text-text antialiased">
        <main>
          <ErrorPage {...props} />
        </main>
      </body>
    </html>
  );
}
