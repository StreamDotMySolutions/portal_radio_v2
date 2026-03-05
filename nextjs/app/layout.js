import './globals.css'

export const metadata = {
  title: 'RTM Portal',
  description: 'Radio Televisyen Malaysia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        {children}
      </body>
    </html>
  )
}
