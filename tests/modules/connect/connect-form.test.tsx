import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMessage = vi.fn();
vi.mock("@/modules/connect/actions", () => ({
  sendMessage: (...a: unknown[]) => sendMessage(...a),
}));

import { ConnectForm } from "@/modules/connect/components/connect-form";

async function fillValid() {
  await userEvent.type(screen.getByLabelText("Name"), "Ada");
  await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
  await userEvent.type(screen.getByLabelText("Message"), "Found a bug in the hook.");
}

const submit = () => userEvent.click(screen.getByRole("button", { name: "Send message" }));

beforeEach(() => sendMessage.mockReset());

describe("ConnectForm", () => {
  it("checks the fields in the browser before sending anything", async () => {
    render(<ConnectForm />);
    await submit();
    expect(await screen.findByText("Tell me your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email.")).toBeInTheDocument();
    expect(screen.getByText("Write at least 10 characters.")).toBeInTheDocument();
    expect(sendMessage).not.toHaveBeenCalled();
    // focus goes to the first field with a problem
    expect(screen.getByLabelText("Name")).toHaveFocus();
  });

  it("sends the values with the chosen topic and thanks the sender", async () => {
    sendMessage.mockResolvedValue({ status: "sent" });
    render(<ConnectForm />);
    await fillValid();
    await userEvent.click(screen.getByRole("combobox", { name: "Topic" }));
    await userEvent.click(await screen.findByRole("option", { name: "Report a bug" }));
    await submit();
    const thanks = await screen.findByText(/thanks, your message is in/i);
    expect(thanks).toHaveFocus();
    expect(sendMessage).toHaveBeenCalledWith({
      name: "Ada",
      email: "ada@example.com",
      topic: "bug",
      message: "Found a bug in the hook.",
      hp_extra: "",
    });
  });

  it("shows a field error the server sends back", async () => {
    sendMessage.mockResolvedValue({ status: "invalid", errors: { email: "That email bounced." } });
    render(<ConnectForm />);
    await fillValid();
    await submit();
    expect(await screen.findByText("That email bounced.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("keeps what the user typed when sending fails", async () => {
    sendMessage.mockResolvedValue({ status: "error", message: "Couldn’t send. Try again." });
    render(<ConnectForm />);
    await fillValid();
    await submit();
    expect(await screen.findByText("Couldn’t send. Try again.")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toHaveValue("Found a bug in the hook.");
  });
});
