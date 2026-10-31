import type { Metadata } from "next";
import Link from "next/link";
import { StatusPage } from "@/components/status-page";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found · Revio" };

export default function NotFound() {
  return (
    <main>
      <StatusPage
        title="Page not found"
        actions={
          <>
            <Link href="/" className={buttonVariants()}>
              Go home
            </Link>
            <Link href="/repos" className={buttonVariants({ variant: "outline" })}>
              Open the dashboard
            </Link>
          </>
        }
      >
        <p>This page doesn’t exist or has moved. Check the address, or start again from home.</p>
      </StatusPage>
    </main>
  );
}
