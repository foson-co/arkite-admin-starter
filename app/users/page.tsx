'use client'

import { useEffect, useState } from 'react'
import {
  Badge,
  DataTable,
  PageHeader,
  toast,
  useServerTable,
  type Column,
} from '@arkite-ui/core'

interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
  status: 'active' | 'inactive'
}

const columns: Column<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  {
    key: 'role',
    header: 'Role',
    filterable: true,
    // Server mode requires the full option list — page data would be partial
    filterOptions: ['Admin', 'Editor', 'Viewer'],
  },
  {
    key: 'status',
    header: 'Status',
    cell: (u) => (
      <Badge variant={u.status === 'active' ? 'success' : 'secondary'}>{u.status}</Badge>
    ),
  },
]

export default function UsersPage() {
  // useServerTable owns page/pageSize/sort/filters and pre-wires the six
  // controlled props DataTable's server mode needs. You fetch, it renders.
  const table = useServerTable({ initialPageSize: 20 })
  const [data, setData] = useState<{ rows: User[]; total: number }>({ rows: [], total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const { page, pageSize, sort, filters } = table.query
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (sort?.direction) {
      params.set('sortKey', sort.key)
      params.set('sortDir', sort.direction)
    }
    for (const value of filters.role ?? []) params.append('role', value)

    fetch(`/api/users?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((err) => toast.fromError(err, { prefix: 'Failed to load users' }))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [table.query])

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader title="Users" description="Server-side pagination, sorting, and filtering." />
      <DataTable
        data={data.rows}
        columns={columns}
        getRowKey={(u) => u.id}
        loading={loading}
        totalRows={data.total}
        compact
        rowClassName={(u) => (u.status === 'inactive' ? 'opacity-60' : '')}
        {...table.props}
      />
    </div>
  )
}
