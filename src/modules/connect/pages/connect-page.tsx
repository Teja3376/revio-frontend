import { ConnectForm } from "../components/connect-form";

export function ConnectPage() {
  return (
    <div className="mx-auto grid max-w-page gap-14 px-6 py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
      <div>
        <h1 className="font-display text-5xl leading-tight text-text md:text-6xl">
          For developers, by developers.
        </h1>
        <p className="mt-6 max-w-[48ch] text-lg leading-8 text-text-muted">
          I’m Charan Teja. I built Revio to review my own projects, and I want it to help with
          yours. Tell me what works, what breaks, or what you’re building.
        </p>
        <p className="mt-8">
          <a
            href="https://github.com/Teja3376"
            className="text-accent underline underline-offset-4 hover:text-text"
          >
            Find me on GitHub
          </a>
        </p>
      </div>
      <ConnectForm />
    </div>
  );
}
