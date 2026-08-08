import { NextResponse } from 'next/server'

// ── Mock API ───────────────────────────────────────────────────────────
// Stands in for your real backend. It receives the query produced by
// `useServerTable` (page / pageSize / sort / filters) and returns one
// pre-processed slice plus the total count — the server does the work,
// the DataTable only renders.

interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
  status: 'active' | 'inactive'
}

const ROLES = ['Admin', 'Editor', 'Viewer'] as const
const DB: User[] = Array.from({ length: 137 }, (_, i) => ({
  id: i + 1,
  name: `User ${String(i + 1).padStart(3, '0')}`,
  email: `user${i + 1}@example.com`,
  role: ROLES[i % 3],
  status: i % 7 === 0 ? 'inactive' : 'active',
}))

export async function GET(request: Request) {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? 1)
  const pageSize = Number(url.searchParams.get('pageSize') ?? 20)
  const sortKey = url.searchParams.get('sortKey')
  const sortDir = url.searchParams.get('sortDir')
  const role = url.searchParams.getAll('role')

  let rows = role.length > 0 ? DB.filter((u) => role.includes(u.role)) : [...DB]

  if (sortKey && sortDir) {
    rows.sort((a, b) => {
      const av = a[sortKey as keyof User]
      const bv = b[sortKey as keyof User]
      if (av === bv) return 0
      return (av < bv ? -1 : 1) * (sortDir === 'asc' ? 1 : -1)
    })
  }

  const start = (page - 1) * pageSize
  return NextResponse.json({
    rows: rows.slice(start, start + pageSize),
    total: rows.length,
  })
}
