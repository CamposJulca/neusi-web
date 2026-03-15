import Navbar         from "./components/Navbar";
import HeroSection     from "./sections/HeroSection";
import MetricsSection  from "./sections/MetricsSection";
import ServicesSection from "./sections/ServicesSection";
import ProposalSection from "./sections/ProposalSection";
import CasesSection    from "./sections/CasesSection";
import TeamSection     from "./sections/TeamSection";
import AboutSection    from "./sections/AboutSection";
import ContactSection  from "./sections/ContactSection";
import FooterSection   from "./sections/FooterSection";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MetricsSection />
        <ServicesSection />
        <ProposalSection />
        <CasesSection />
        <TeamSection />
        <AboutSection />
        <ContactSection />
      </main>
      <FooterSection />
    </>
  );
}
