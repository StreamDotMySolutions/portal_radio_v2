import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import GovBanner from '@/components/GovBanner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BootstrapClient from '@/components/BootstrapClient';

export const metadata = {
  title: 'PortalRadio v2 — RTM',
  description: 'Platform digital penyiaran RTM — televisyen, radio, dan berita dalam satu tempat.',
  lang: 'ms',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <body>
        <GovBanner />
        <Navbar />
        <BootstrapClient />
        {children}
        <Footer />
      </body>
    </html>
  );
}
