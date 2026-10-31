"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewDetailPage } from "./review-detail-page";

function FromParams() {
  const { id } = useParams<{ id: string }>();
  return <ReviewDetailPage id={id} />;
}

/** The id comes from the URL at request time, so it streams in behind Suspense. */
export function ReviewDetailRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-10 w-2/3" />}>
      <FromParams />
    </Suspense>
  );
}
