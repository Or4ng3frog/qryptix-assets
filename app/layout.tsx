import type { Metadata } from 'next';
import './globals.css';
import { SITE } from '@/lib/config';
import { Web3Provider } from '@/components/Web3Provider';

export const metadata: Metadata = {
  title: `${SITE.name} (${SITE.ticker}) — ${SITE.tagline}`,
  description: SITE.description,
  metadataBase: new URL(`https://${SITE.domain}`),
  openGraph: {
    title: `${SITE.name} (${SITE.ticker})`,
    description: SITE.description,
    url: `https://${SITE.domain}`,
    siteName: SITE.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} (${SITE.ticker})`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="noise">
        {/* Ambient background layers */}
        <div className="fixed inset-0 -z-10 bg-void" />
        <div className="fixed inset-0 -z-10 bg-grid-fade" />
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-[1000px] opacity-60"
          style={{ background: 'radial-gradient(ellipse at center, rgba(168,139,255,0.12), transparent 70%)' }}
        />
        <div
          className="fixed bottom-0 right-0 -z-10 h-[500px] w-[500px] opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(61,224,208,0.08), transparent 70%)' }}
        />
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
