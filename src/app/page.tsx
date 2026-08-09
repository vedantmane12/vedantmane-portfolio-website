import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Nav } from "@/components/nav";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { TechStack } from "@/components/sections/tech-stack";
import { Work } from "@/components/sections/work";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main-content" className="flex-1">
        <Hero />
        <About />
        <Education />
        <Experience />
        {/* Projects sits between Experience and Skills as supporting evidence.
            Keep this order in sync with `sections` in content/site.ts. */}
        <Work />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
