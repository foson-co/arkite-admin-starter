import './globals.css'
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
      </body>
    </html>
  )
}
