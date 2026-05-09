import { z } from "zod";

const uuidLike = z.string().uuid();

export const eventCreateSchema = z.object({
  organization_id: uuidLike,
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1).max(200),
});

export type EventCreateInput = z.infer<typeof eventCreateSchema>;

/** PATCH では draft を送れない（作成時のみ draft）。昇格は live → archived のみ。 */
export const eventPhasePatchSchema = z.object({
  phase: z.enum(["live", "archived"]),
});

export type EventPhasePatchInput = z.infer<typeof eventPhasePatchSchema>;
