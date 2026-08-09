'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  AdminLayout,
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Kbd,
  TenantSwitcher,
  toast,
  useCommandPalette,
  type AdminNavGroup,
  type TenantItem,
} from '@arkite-ui/core'
import { BarChart3, CreditCard, History, Home, LayoutGrid, Search, Settings, Users } from 'lucide-react'
import { useState, type ReactNode } from 'react'

// ── App-level wiring, done once ────────────────────────────────────────
// Teach toast.fromError how to turn YOUR API errors into messages.
// Replace with your real parser (e.g. read your API envelope's `detail`).
toast.configure({
  formatError: (err) => (err instanceof Error ? err.message : String(err)),
})

const navigation: AdminNavGroup[] = [
  {
    label: 'General',
    items: [
      { path: '/', label: 'Dashboard', icon: <Home size={16} /> },
      { path: '/users', label: 'Users', icon: <Users size={16} /> },
      { path: '/billing', label: 'Billing', icon: <CreditCard size={16} /> },
      { path: '/reports', label: 'Reports', icon: <BarChart3 size={16} /> },
      { path: '/activity', label: 'Activity', icon: <History size={16} /> },
      { path: '/settings', label: 'Settings', icon: <Settings size={16} /> },
    ],
  },
  {
    label: 'Library',
    items: [{ path: '/components', label: 'Components', icon: <LayoutGrid size={16} /> }],
  },
]

const bottomTabs = [
  { path: '/', label: 'Home', icon: <Home size={18} /> },
  { path: '/users', label: 'Users', icon: <Users size={18} /> },
  { path: '/billing', label: 'Billing', icon: <CreditCard size={18} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
]

const tenants: TenantItem[] = [
  { id: 'acme', name: 'Acme Inc.', planLabel: 'Pro' },
  { id: 'northwind', name: 'Northwind Traders', planLabel: 'Enterprise' },
  { id: 'initech', name: 'Initech', planLabel: 'Free' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [tenant, setTenant] = useState<TenantItem | null>(tenants[0])
  const palette = useCommandPalette()

  const go = (path: string) => {
    palette.setOpen(false)
    router.push(path)
  }

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
      navbarLeft={
        <TenantSwitcher
          tenants={tenants}
          value={tenant}
          onChange={setTenant}
        />
      }
      navbarRight={
        <Button
          variant="outline"
          size="sm"
          onClick={() => palette.setOpen(true)}
          className="gap-2 text-muted-foreground"
        >
          <Search size={14} />
          Search…
          <Kbd size="sm">⌘K</Kbd>
        </Button>
      }
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

      {/* Delete freely — or leave it and every deploy links the library */}
      <footer className="mt-10 border-t pt-4 text-center text-xs text-muted-foreground">
        Built with{' '}
        <a href="https://ui.foson.co" className="underline underline-offset-2 hover:text-foreground">
          Arkite UI
        </a>{' '}
        — React components for SaaS admin panels
      </footer>

      {/* ⌘K command palette — useCommandPalette binds the shortcut */}
      <CommandDialog open={palette.open} onClose={() => palette.setOpen(false)}>
        <CommandInput placeholder="Jump to…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => go('/')}>Dashboard</CommandItem>
            <CommandItem onSelect={() => go('/users')}>Users</CommandItem>
            <CommandItem onSelect={() => go('/billing')}>Billing</CommandItem>
            <CommandItem onSelect={() => go('/activity')}>Activity</CommandItem>
            <CommandItem onSelect={() => go('/settings')}>Settings</CommandItem>
            <CommandItem onSelect={() => go('/components')}>Component gallery</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                palette.setOpen(false)
                toast.success('Cache cleared', { description: 'Demo action from the palette.' })
              }}
            >
              Clear cache
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </AdminLayout>
  )
}
