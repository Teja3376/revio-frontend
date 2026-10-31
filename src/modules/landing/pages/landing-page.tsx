import { PageTransition } from "@/components/page-transition";
import { Hero } from "../components/hero";
import { InstallSection } from "../components/install-section";
import { ToolsSection } from "../components/tools-section";

export function LandingPage() {
  return (
    <PageTransition>
      <Hero />
      <ToolsSection />
      <InstallSection />
    </PageTransition>
  );
}
