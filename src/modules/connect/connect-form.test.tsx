import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const sendMessage = vi.fn();
vi.mock("./actions", () => ({ sendMessage: (...a: unknown[]) => sendMessage(...a) }));

import { ConnectForm } from "./components/connect-form";

async function fill() {
  await userEvent.type(screen.getByLabelText("Name"), "Ada");
  await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
  await userEvent.selectOptions(screen.getByLabelText("Topic"), "bug");
  await userEvent.type(screen.getByLabelText("Message"), "Found a bug in the hook.");
  await userEvent.click(screen.getByRole("button", { name: "Send message" }));
}

describe("ConnectForm", () => {
  it("thanks the sender after a successful send", async () => {
    sendMessage.mockResolvedValue({ status: "sent" });
    render(<ConnectForm />);
    await fill();
    expect(await screen.findByText(/thanks, your message is in/i)).toBeInTheDocument();
  });

  it("shows the field error next to its field", async () => {
    sendMessage.mockResolvedValue({ status: "invalid", errors: { email: "Enter a valid email." } });
    render(<ConnectForm />);
    await fill();
    expect(await screen.findByText("Enter a valid email.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("keeps what the user typed when sending fails", async () => {
    sendMessage.mockImplementation(async (_prev: unknown, data: FormData) => ({
      status: "error",
      message: "Couldn't send. Try again.",
      values: Object.fromEntries(
        ["name", "email", "topic", "message"].map((k) => [k, data.get(k)]),
      ),
    }));
    render(<ConnectForm />);
    await fill();
    expect(await screen.findByText("Couldn't send. Try again.")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toHaveValue("Found a bug in the hook.");
  });
});
