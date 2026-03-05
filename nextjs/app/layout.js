import './globals.css'

export const metadata = {
  title: 'RTM Portal',
  description: 'Radio Televisyen Malaysia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-gray-100">
        {children}
      </body>
    </html>
  )
}
