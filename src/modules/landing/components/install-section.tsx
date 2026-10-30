import { SignInButton } from "@/modules/auth";
import { CopyCommand } from "./copy-command";

export function InstallSection() {
  return (
    <section aria-labelledby="install-heading" className="border-t border-border">
      <div className="mx-auto max-w-[1120px] px-6 py-24">
        <h2 id="install-heading" className="text-3xl font-semibold text-text">
          Get Revio
        </h2>
        <ul className="mt-10 grid gap-10 md:grid-cols-3">
          <li>
            <h3 className="font-semibold text-text">CLI</h3>
            <p className="mt-2 text-sm text-text-muted">Needs Node 22 and a Gemini API key.</p>
            <CopyCommand command="npm i -g @revio/cli" className="mt-5" />
          </li>
          <li>
            <h3 className="font-semibold text-text">VS Code</h3>
            <p className="mt-2 text-sm text-text-muted">Reviews each commit inside the editor.</p>
            <p className="mt-5 text-sm text-text">Coming soon to the Marketplace</p>
          </li>
          <li>
            <h3 className="font-semibold text-text">GitHub App</h3>
            <p className="mt-2 text-sm text-text-muted">
              Sign in, then install it on the repos you choose.
            </p>
            <SignInButton variant="text" className="mt-3" />
          </li>
        </ul>
      </div>
    </section>
  );
}
