import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BootstrapClient from '@/components/BootstrapClient'

export const metadata = {
  title: 'RTM Portal',
  description: 'Radio Televisyen Malaysia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body>
        <BootstrapClient />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
