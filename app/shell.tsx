'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AdminLayout, toast, type AdminNavGroup } from '@arkite-ui/core'
import { Home, Settings, Users } from 'lucide-react'
import type { ReactNode } from 'react'

// ── App-level wiring, done once ────────────────────────────────────────
// Teach toast.fromError how to turn YOUR API errors into messages.
// Replace with your real parser (e.g. read your API envelope's `detail`).
toast.configure({
  formatError: (err) =>
    err instanceof Error ? err.message : String(err),
})

const navigation: AdminNavGroup[] = [
  {
    label: 'General',
    items: [
      { path: '/', label: 'Dashboard', icon: <Home size={16} /> },
      { path: '/users', label: 'Users', icon: <Users size={16} /> },
      { path: '/settings', label: 'Settings', icon: <Settings size={16} /> },
    ],
  },
]

const bottomTabs = [
  { path: '/', label: 'Home', icon: <Home size={18} /> },
  { path: '/users', label: 'Users', icon: <Users size={18} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
]

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <AdminLayout
      currentPath={pathname}
      navigation={navigation}
      brand={{ name: 'Acme Admin', shortName: 'A' }}
      // Wire your auth here: user, hasPermission, onLogout
      user={{ name: 'Jane Doe', email: 'jane@example.com', roleLabel: 'Admin' }}
      onNavigate={(path) => router.push(path)}
      renderLink={({ href, children, className }) => (
        <Link href={href} className={className}>
          {children}
        </Link>
      )}
      // Desktop keeps the sidebar; below `md` the bottom tabs take over
      hideSidebar="mobile"
      bottomNav={
        <div className="flex">
          {bottomTabs.map((tab) => (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
                pathname === tab.path ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          ))}
        </div>
      }
    >
      {children}
    </AdminLayout>
  )
}
