import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/sections/Hero';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { PresaleSection } from '@/components/sections/PresaleSection';
import { Features } from '@/components/sections/Features';
import { Tokenomics } from '@/components/sections/Tokenomics';
import { Roadmap } from '@/components/sections/Roadmap';
import { Founder } from '@/components/sections/Founder';
import { RefundSection } from '@/components/sections/RefundSection';
import { Miners } from '@/components/sections/Miners';
import { Community } from '@/components/sections/Community';
import { WhitepaperCTA, FAQ } from '@/components/sections/FAQ';
import { RiskDisclosure, Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <PresaleSection />
        <Features />
        <Tokenomics />
        <Roadmap />
        <Founder />
        <RefundSection />
        <Miners />
        <Community />
        <WhitepaperCTA />
        <FAQ />
        <RiskDisclosure />
      </main>
      <Footer />
    </>
  );
}
