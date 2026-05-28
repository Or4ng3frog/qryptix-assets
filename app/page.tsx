import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/sections/Hero';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { Features } from '@/components/sections/Features';
import { Tokenomics } from '@/components/sections/Tokenomics';
import { Founder } from '@/components/sections/Founder';
import { Roadmap } from '@/components/sections/Roadmap';
import { Miners } from '@/components/sections/Miners';
import { WhitepaperCTA, FAQ } from '@/components/sections/FAQ';
import { RiskDisclosure, Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Features />
        <Tokenomics />
        <Founder />
        <Roadmap />
        <Miners />
        <WhitepaperCTA />
        <FAQ />
        <RiskDisclosure />
      </main>
      <Footer />
    </>
  );
}
