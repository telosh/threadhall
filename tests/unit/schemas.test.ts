import { describe, expect, it } from "vitest";

import { eventCreateSchema, eventPhasePatchSchema } from "@/schemas/event";
import { organizationCreateSchema } from "@/schemas/organization";
import { threadCreateSchema } from "@/schemas/thread";

const sampleOrgId = "00000000-0000-4000-8000-000000000001";

describe("organizationCreateSchema", () => {
  it("accepts a valid slug and display name", () => {
    const parsed = organizationCreateSchema.parse({
      slug: "acme-corp",
      display_name: "ACME",
    });
    expect(parsed).toEqual({ slug: "acme-corp", display_name: "ACME" });
  });

  it("rejects invalid slugs", () => {
    expect(() =>
      organizationCreateSchema.parse({
        slug: "ACME",
        display_name: "ACME",
      }),
    ).toThrow();

    expect(() =>
      organizationCreateSchema.parse({
        slug: "acme_corp",
        display_name: "ACME",
      }),
    ).toThrow();
  });
});

describe("eventCreateSchema", () => {
  it("accepts valid input", () => {
    const parsed = eventCreateSchema.parse({
      organization_id: sampleOrgId,
      slug: "summer-party",
      title: "Summer Party",
    });
    expect(parsed.title).toBe("Summer Party");
  });

  it("rejects non-UUID organization_id", () => {
    expect(() =>
      eventCreateSchema.parse({
        organization_id: "not-a-uuid",
        slug: "summer-party",
        title: "Summer Party",
      }),
    ).toThrow();
  });
});

describe("eventPhasePatchSchema", () => {
  it("allows live and archived only", () => {
    expect(eventPhasePatchSchema.parse({ phase: "live" }).phase).toBe("live");
    expect(eventPhasePatchSchema.parse({ phase: "archived" }).phase).toBe(
      "archived",
    );
  });

  it("rejects draft", () => {
    const r = eventPhasePatchSchema.safeParse({ phase: "draft" });
    expect(r.success).toBe(false);
  });
});

describe("threadCreateSchema", () => {
  it("defaults thread_kind to persistent", () => {
    const parsed = threadCreateSchema.parse({
      organization_id: sampleOrgId,
      slug: "announcements",
      title: "Announcements",
    });
    expect(parsed.thread_kind).toBe("persistent");
  });

  it("accepts event_tied", () => {
    const parsed = threadCreateSchema.parse({
      organization_id: sampleOrgId,
      slug: "booth-5",
      title: "Booth 5",
      thread_kind: "event_tied",
    });
    expect(parsed.thread_kind).toBe("event_tied");
  });
});
