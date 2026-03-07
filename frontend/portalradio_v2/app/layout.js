import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import './accessibility.css';
import GovBanner from '@/components/GovBanner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BootstrapClient from '@/components/BootstrapClient';
import AccessibilityToggle from '@/components/AccessibilityToggle';
import { AccessibilityProvider } from '@/context/AccessibilityContext';

export const metadata = {
  title: 'PortalRadio v2 — RTM',
  description: 'Platform digital penyiaran RTM — televisyen, radio, dan berita dalam satu tempat.',
  lang: 'ms',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=OpenDyslexic:ital,wght@0,400;0,700;1,400;1,700&display=swap" />
      </head>
      <body>
        <AccessibilityProvider>
          <header className="header-overlay">
            <GovBanner />
            <Navbar />
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
