import './globals.css'
import Script from 'next/script'
import type { ReactNode } from 'react'
import { AppShell } from './shell'

export const metadata = {
  title: 'Arkite Admin Starter',
  description:
    'Next.js admin panel starter built on @arkite-ui/core — server-side data table, settings form, dashboard, mobile bottom nav.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
        {/* Cloudflare Web Analytics — shared foson.co site, filter by hostname */}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon='{"token": "8c2976d201ff4eb09e89382e42ee62c6"}'
        />
      </body>
    </html>
  )
}
