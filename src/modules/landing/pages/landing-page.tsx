import { Hero } from "../components/hero";
import { InstallSection } from "../components/install-section";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { ToolsSection } from "../components/tools-section";

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ToolsSection />
        <InstallSection />
      </main>
      <SiteFooter />
    </>
  );
}
