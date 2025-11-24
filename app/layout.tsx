import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Marketing KPI Benchmark - Brevo',
  description: 'Benchmark des KPIs marketing pour votre secteur',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
