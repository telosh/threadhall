import { z } from "zod";

/** HTTP / Server Action 境界用（DB 行型は `OrganizationRow` を参照） */
export const organizationCreateSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug は小文字・数字・ハイフンのみ"),
  display_name: z.string().min(1).max(200),
});

export type OrganizationCreate = z.infer<typeof organizationCreateSchema>;
