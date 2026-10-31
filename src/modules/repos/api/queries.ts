"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { type Repo, RepoListSchema, type RepoPatch, RepoSchema } from "../schemas";

export const reposKey = ["repos"] as const;

export function useRepos() {
  return useQuery({ queryKey: reposKey, queryFn: () => api.request("/repos", RepoListSchema) });
}

/** Saves a change, showing it at once and putting it back if the save fails. */
export function useUpdateRepo(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: RepoPatch) =>
      api.request(`/repos/${id}`, RepoSchema, { method: "PATCH", body: patch }),
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: reposKey });
      const before = qc.getQueryData<{ items: Repo[] }>(reposKey);
      qc.setQueryData<{ items: Repo[] }>(reposKey, (old) =>
        old ? { items: old.items.map((r) => (r.id === id ? { ...r, ...patch } : r)) } : old,
      );
      return { before };
    },
    onError: (_e, _patch, ctx) => {
      if (ctx?.before) qc.setQueryData(reposKey, ctx.before);
    },
    onSuccess: (repo) => {
      qc.setQueryData<{ items: Repo[] }>(reposKey, (old) =>
        old ? { items: old.items.map((r) => (r.id === repo.id ? repo : r)) } : old,
      );
    },
  });
}
