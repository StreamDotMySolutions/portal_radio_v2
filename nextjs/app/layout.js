export const metadata = {
  title: 'RTM Portal',
  description: 'Radio Televisyen Malaysia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
