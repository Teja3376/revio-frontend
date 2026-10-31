"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ReviewDetailSchema, ReviewListSchema } from "../schemas";

export function useReviews({ repo, page }: { repo?: string; page: number }) {
  const query = `${repo ? `repo=${encodeURIComponent(repo)}&` : ""}page=${page}`;
  return useQuery({
    queryKey: ["reviews", repo ?? "all", page],
    queryFn: () => api.request(`/reviews?${query}`, ReviewListSchema),
    placeholderData: keepPreviousData,
  });
}

export function useReview(id: string) {
  return useQuery({
    queryKey: ["review", id],
    queryFn: () => api.request(`/reviews/${encodeURIComponent(id)}`, ReviewDetailSchema),
  });
}
