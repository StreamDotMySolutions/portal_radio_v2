import './globals.css'
import GovBanner from '@/components/GovBanner'
import Header from '@/components/Header'
import SubNav from '@/components/SubNav'
import Footer from '@/components/Footer'
import BootstrapClient from '@/components/BootstrapClient'
import AccessibilityToggle from '@/components/AccessibilityToggle'
import { AccessibilityProvider } from '@/context/AccessibilityContext'

export const metadata = {
  title: 'RTM Portal',
  description: 'Radio Televisyen Malaysia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body>
        <BootstrapClient />
        <AccessibilityProvider>
          <GovBanner />
          <Header />
          <SubNav />
          <main>{children}</main>
          <Footer />
          <AccessibilityToggle />
        </AccessibilityProvider>
      </body>
    </html>
  )
}
