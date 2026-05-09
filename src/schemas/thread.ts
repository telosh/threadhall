import { z } from "zod";

const uuidLike = z.string().uuid();

export const threadCreateSchema = z.object({
  organization_id: uuidLike,
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug は小文字・数字・ハイフンのみ"),
  title: z.string().min(1).max(300),
  thread_kind: z.enum(["persistent", "event_tied"]).default("persistent"),
});

export type ThreadCreate = z.infer<typeof threadCreateSchema>;
