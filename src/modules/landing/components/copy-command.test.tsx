import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyCommand } from "./copy-command";

const CMD = "npm i -g @revio/cli";

function setClipboard(value: unknown) {
  Object.defineProperty(navigator, "clipboard", { value, configurable: true });
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

// Let the clipboard promise settle under fake timers.
const click = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button"));
  });
};

describe("CopyCommand", () => {
  it("copies the command and says Copied for 2 seconds", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    render(<CopyCommand command={CMD} />);
    expect(screen.getByRole("button", { name: "Copy command" })).toBeInTheDocument();

    await click();
    expect(writeText).toHaveBeenCalledWith(CMD);
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("button", { name: "Copy command" })).toBeInTheDocument();
  });

  it("says Copy failed when the clipboard is missing, and keeps the command visible", async () => {
    setClipboard(undefined);
    render(<CopyCommand command={CMD} />);
    await click();
    expect(screen.getByRole("button", { name: "Copy failed" })).toBeInTheDocument();
    expect(screen.getByText(CMD)).toBeInTheDocument();
  });

  it("keeps the $ prompt out of the selectable command", () => {
    setClipboard(undefined);
    const { container } = render(<CopyCommand command={CMD} />);
    expect(container.querySelector("code")?.textContent).toBe(CMD);
  });

  it("says Copy failed when writing is denied", async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error("denied")) });
    render(<CopyCommand command={CMD} />);
    await click();
    expect(screen.getByRole("button", { name: "Copy failed" })).toBeInTheDocument();
  });
});
