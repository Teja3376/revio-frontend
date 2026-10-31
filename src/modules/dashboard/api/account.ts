"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, SAMPLE_MODE } from "@/lib/api";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { MeSchema } from "../schemas";

export function useMe() {
  return useQuery({ queryKey: ["me"], queryFn: () => api.request("/me", MeSchema) });
}

export function useSignOut() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return {
    pending,
    async signOut() {
      setPending(true);
      if (!SAMPLE_MODE) await createBrowserSupabase().auth.signOut();
      router.push("/");
    },
  };
}
