import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.fn();
const from = vi.fn(() => ({ insert }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminSupabase: () => ({ from }) }));

import { sendMessage } from "./actions";

const IDLE = { status: "idle" } as const;

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
}

const valid = {
  name: "Ada",
  email: "ada@example.com",
  topic: "feedback",
  message: "Revio caught a real bug in my PR. Thanks!",
};

beforeEach(() => {
  insert.mockReset();
  from.mockClear();
  insert.mockResolvedValue({ error: null });
});

describe("sendMessage", () => {
  it("saves a valid message", async () => {
    expect(await sendMessage(IDLE, form(valid))).toEqual({ status: "sent" });
    expect(from).toHaveBeenCalledWith("contact_messages");
    expect(insert).toHaveBeenCalledWith(valid);
  });

  it("trims fields before saving", async () => {
    await sendMessage(IDLE, form({ ...valid, name: "  Ada  ", email: " ada@example.com " }));
    expect(insert).toHaveBeenCalledWith(valid);
  });

  it("returns field errors and saves nothing for bad input", async () => {
    const state = await sendMessage(
      IDLE,
      form({ name: "", email: "not-an-email", topic: "spam", message: "hi" }),
    );
    expect(state.status).toBe("invalid");
    if (state.status !== "invalid") return;
    expect(Object.keys(state.errors).sort()).toEqual(["email", "message", "name", "topic"]);
    expect(insert).not.toHaveBeenCalled();
  });

  it("pretends success for bots that fill the hidden field", async () => {
    expect(await sendMessage(IDLE, form({ ...valid, hp_extra: "http://spam" }))).toEqual({
      status: "sent",
    });
    expect(insert).not.toHaveBeenCalled();
  });

  it("reports a failure when saving fails", async () => {
    insert.mockResolvedValue({ error: { message: "relation does not exist" } });
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const state = await sendMessage(IDLE, form(valid));
    expect(state.status).toBe("error");
    // returned so the form can refill what the user typed
    expect(state.status === "error" && state.values).toEqual(valid);
    // the owner can see why sends fail
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });

  it("reports the database's rate limit as a friendly message", async () => {
    insert.mockResolvedValue({ error: { message: "rate_limited: too many messages" } });
    const state = await sendMessage(IDLE, form(valid));
    expect(state.status === "error" && state.message).toMatch(/too many messages/i);
  });

  it("reports a failure when the client throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    from.mockImplementationOnce(() => {
      throw new Error("Your project's URL and Key are required");
    });
    expect((await sendMessage(IDLE, form(valid))).status).toBe("error");
  });
});
