import { Code, CodeBlock, Command, DocSection, DocTable } from "../components/docs-ui";

const step = "space-y-3 pl-1 marker:font-semibold marker:text-accent";

export function FirstReview() {
  return (
    <DocSection id="first-review" title="Your first review">
      <p>
        New to code review tools, or to the terminal? Follow these steps in order. It takes about
        ten minutes, and you can’t break anything.
      </p>
      <ol className="ml-5 list-decimal space-y-8">
        <li className={step}>
          <p>
            <strong className="text-text">Check that Node is installed.</strong> Open a terminal
            (Terminal on macOS, PowerShell on Windows) and run:
          </p>
          <Command>node -v</Command>
          <p>
            You need <Code>v22.12</Code> or newer. If the command isn’t found or the number is
            lower, install the LTS version from{" "}
            <a href="https://nodejs.org" className="text-accent underline underline-offset-4">
              nodejs.org
            </a>{" "}
            and open a new terminal.
          </p>
        </li>
        <li className={step}>
          <p>
            <strong className="text-text">Install Revio.</strong>
          </p>
          <Command>npm i -g @revio/cli</Command>
          <p>
            Then <Code>revio --version</Code> should print a version number.
          </p>
        </li>
        <li className={step}>
          <p>
            <strong className="text-text">Get a Gemini API key.</strong> Revio uses Google’s Gemini
            to read your code. Go to{" "}
            <a
              href="https://aistudio.google.com/apikey"
              className="text-accent underline underline-offset-4"
            >
              Google AI Studio
            </a>
            , sign in, choose Create API key, and copy it. Treat it like a password.
          </p>
        </li>
        <li className={step}>
          <p>
            <strong className="text-text">Give Revio the key.</strong> On macOS or Linux, add this
            line to <Code>~/.zshrc</Code> (or <Code>~/.bashrc</Code>), then open a new terminal:
          </p>
          <CodeBlock label="~/.zshrc">{'export GEMINI_API_KEY="your-key"'}</CodeBlock>
          <p>On Windows, run this once, then open a new terminal:</p>
          <CodeBlock label="PowerShell">{'setx GEMINI_API_KEY "your-key"'}</CodeBlock>
        </li>
        <li className={step}>
          <p>
            <strong className="text-text">Change something.</strong> Open a project that uses git
            (inside it, <Code>git status</Code> works). Edit a file you’ve committed before and save
            it.
          </p>
        </li>
        <li className={step}>
          <p>
            <strong className="text-text">Run your first review</strong> from the project folder:
          </p>
          <Command>revio review</Command>
          <p>
            You’ll see <Code>No issues found.</Code> or a list like the one below.
          </p>
        </li>
      </ol>
      <h3 className="mt-4 font-medium text-text">Reading a line</h3>
      <CodeBlock label="Example">
        {
          "src/api/users.ts:42  ✖ error  [security] User input is passed to the SQL query unescaped.\n    → Use a parameterized query."
        }
      </CodeBlock>
      <DocTable
        label="Parts of a Revio line"
        head={["Part", "Example", "What it means"]}
        rows={[
          [
            "File and line",
            <Code key="c">src/api/users.ts:42</Code>,
            "Where the problem is. Open that file at that line.",
          ],
          [
            "Severity",
            <Code key="c">error</Code>,
            "error: likely breaks something or is a security hole. warning: probably a bug. info: worth a look.",
          ],
          [
            "Category",
            <Code key="c">[security]</Code>,
            "What kind of problem: bug, security, performance, quality or style.",
          ],
          ["Message", "User input is passed…", "What is wrong, in one sentence."],
          [
            "Suggestion",
            <Code key="c">→ Use a parameterized query.</Code>,
            "How to fix it. Not every issue has one.",
          ],
        ]}
      />
      <p>
        Fix what makes sense, save, and run <Code>revio review</Code> again. When you’re ready for
        more, read the{" "}
        <a href="#daily-use" className="text-accent underline underline-offset-4">
          everyday workflow
        </a>
        .
      </p>
    </DocSection>
  );
}

export function Glossary() {
  return (
    <DocSection id="glossary" title="Words you’ll see">
      <DocTable
        label="Glossary"
        head={["Word", "Meaning"]}
        rows={[
          ["Diff", "The lines you added, changed or removed. Revio only reviews these."],
          ["Commit", "A saved snapshot of your project in git."],
          ["Staged", "Changes you’ve marked with git add to go into the next commit."],
          ["Branch", "A separate line of work, usually merged into main through a pull request."],
          [
            "Pull request (PR)",
            "A request on GitHub to merge your branch, where others review it.",
          ],
          [
            "Depth",
            "How hard Revio looks: quick (bugs, security), normal (+ performance, quality), full (+ style, summary, risk).",
          ],
          ["Severity", "How serious an issue is: error, warning or info."],
        ]}
      />
    </DocSection>
  );
}
