import { describe, expect, it } from "vitest";
import { ContactSchema } from "@/modules/connect/schema";

describe("ContactSchema", () => {
  it("accepts an email with spaces around it and trims it", () => {
    const parsed = ContactSchema.parse({
      name: "Ada",
      email: "  ada@example.com ",
      topic: "bug",
      message: "This is long enough.",
    });
    expect(parsed.email).toBe("ada@example.com");
  });
});
