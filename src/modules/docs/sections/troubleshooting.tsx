import { Code, DocSection, DocTable } from "../components/docs-ui";

const row = (message: string, fix: string) => [<Code key="m">{message}</Code>, fix];

export function Troubleshooting() {
  return (
    <DocSection id="troubleshooting" title="Messages and fixes">
      <DocTable
        label="Messages and fixes"
        head={["You see", "What to do"]}
        rows={[
          row(
            "No changes to review.",
            "Nothing changed since your last commit, or the change is in a new file: run git add on it, or use revio watch.",
          ),
          row(
            "Revio needs a git repository.",
            "Run Revio inside a git project. Start one with git init.",
          ),
          row(
            "Set GEMINI_API_KEY to use Revio.",
            "Add your key (step 4 of Your first review) and open a new terminal.",
          ),
          row(
            "Gemini refused the request (403): …",
            "The key is wrong, or its Google project needs billing turned on (“free tier not available”).",
          ),
          row(
            "Gemini rate limit reached. Wait a minute and try again.",
            "You sent many reviews quickly. Wait a minute.",
          ),
          row(
            "Gemini did not respond in time. Try again.",
            "Gemini was slow. Run the review again.",
          ),
          row(
            "Could not reach Gemini. Check your internet connection.",
            "Check your connection, VPN or proxy.",
          ),
          row(
            "Revio could not read the AI response for …. Try again.",
            "Gemini answered in a broken shape twice. Nothing was shown; run the review again.",
          ),
          row(
            "Invalid …/.revio.json: …",
            "A key or value in .revio.json is wrong. The message names the field; see Configuration.",
          ),
        ]}
      />
    </DocSection>
  );
}
