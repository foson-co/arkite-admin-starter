// Shared mock data + query logic. The API route (app/api/users/route.ts)
// uses it on the server; the static live demo calls it directly in the
// browser. In your real app, delete this file and point the users page at
// your backend.

export interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
  status: 'active' | 'inactive'
}

export interface UsersQuery {
  page: number
  pageSize: number
  sortKey?: string | null
  sortDir?: string | null
  role?: string[]
}

export interface UsersResult {
  rows: User[]
  total: number
}

const ROLES = ['Admin', 'Editor', 'Viewer'] as const

export const DB: User[] = Array.from({ length: 137 }, (_, i) => ({
  id: i + 1,
  name: `User ${String(i + 1).padStart(3, '0')}`,
  email: `user${i + 1}@example.com`,
  role: ROLES[i % 3],
  status: i % 7 === 0 ? 'inactive' : 'active',
}))

export function queryUsers({ page, pageSize, sortKey, sortDir, role }: UsersQuery): UsersResult {
  let rows = role && role.length > 0 ? DB.filter((u) => role.includes(u.role)) : [...DB]

  if (sortKey && sortDir) {
    rows.sort((a, b) => {
      const av = a[sortKey as keyof User]
      const bv = b[sortKey as keyof User]
      if (av === bv) return 0
      return (av < bv ? -1 : 1) * (sortDir === 'asc' ? 1 : -1)
    })
  }

  const start = (page - 1) * pageSize
  return { rows: rows.slice(start, start + pageSize), total: rows.length }
}
