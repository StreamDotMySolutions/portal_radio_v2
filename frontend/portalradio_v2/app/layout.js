import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import './accessibility.css';
import GovBanner from '@/components/GovBanner';
import Responsive from '@/components/Responsive';
import Navbar from '@/components/Navbar';
import NavbarMobile from '@/components/Navbar.mobile';
import Footer from '@/components/Footer';
import BootstrapClient from '@/components/BootstrapClient';
import AccessibilityToggle from '@/components/AccessibilityToggle';
import PageTracker from '@/components/PageTracker';
import { AccessibilityProvider } from '@/context/AccessibilityContext';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://radio.rtm.gov.my';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'PORTAL RADIO RTM',
  description: 'JABATAN PENYIARAN MALAYSIA',
  lang: 'ms',
  openGraph: {
    title: 'PORTAL RADIO RTM',
    description: 'JABATAN PENYIARAN MALAYSIA',
    url: SITE_URL,
    siteName: 'PortalRadio RTM',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PortalRadio RTM',
      },
    ],
    locale: 'ms_MY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PORTAL RADIO RTM',
    description: 'JABATAN PENYIARAN MALAYSIA',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=OpenDyslexic:ital,wght@0,400;0,700;1,400;1,700&display=swap" />
      </head>
      <body>
        <AccessibilityProvider>
          <PageTracker />
          <header className="header-overlay">
            <GovBanner />
            <Responsive mobile={NavbarMobile} desktop={Navbar} />
          </header>
          <BootstrapClient />
          {children}
          <Footer />
          <AccessibilityToggle />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
