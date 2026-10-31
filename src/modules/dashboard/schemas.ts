import { z } from "zod";

export const MeSchema = z.object({
  id: z.string(),
  githubLogin: z.string(),
  avatarUrl: z.string().nullable(),
});
export type Me = z.infer<typeof MeSchema>;
