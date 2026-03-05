import './globals.css'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'RTM Portal',
  description: 'Radio Televisyen Malaysia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
