'use client'

import { useEffect, useState } from 'react'
import {
  Badge,
  BulkActionBar,
  Button,
  DataTable,
  PageHeader,
  toast,
  useServerTable,
  type Column,
} from '@arkite-ui/core'

import { queryUsers, type User } from '../../lib/mock-users'

// The hosted live demo is a static export with no server — it calls the mock
// directly in the browser. Your real app keeps the fetch path only.
const IS_STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === '1'

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
  const [selected, setSelected] = useState<Set<string | number>>(new Set())

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const { page, pageSize, sort, filters } = table.query
    const query = {
      page,
      pageSize,
      sortKey: sort?.direction ? sort.key : null,
      sortDir: sort?.direction ?? null,
      role: filters.role ?? [],
    }

    const load = IS_STATIC_DEMO
      ? // Live demo: no server behind GitHub Pages — run the mock in-browser
        new Promise((r) => setTimeout(r, 250)).then(() => queryUsers(query))
      : fetch(
          `/api/users?${new URLSearchParams([
            ['page', String(query.page)],
            ['pageSize', String(query.pageSize)],
            ...(query.sortKey ? ([['sortKey', query.sortKey], ['sortDir', query.sortDir!]] as [string, string][]) : []),
            ...query.role.map((r): [string, string] => ['role', r]),
          ])}`
        ).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        })

    load
      .then((json) => {
        if (!cancelled) setData(json as { rows: User[]; total: number })
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
    <div className="flex flex-col gap-6">
      <PageHeader title="Users" description="Server-side pagination, sorting, and filtering." />
      <DataTable
        data={data.rows}
        columns={columns}
        getRowKey={(u) => u.id}
        loading={loading}
        totalRows={data.total}
        compact
        selectable
        selectedRows={selected}
        onSelectionChange={setSelected}
        rowClassName={(u) => (u.status === 'inactive' ? 'opacity-60' : '')}
        {...table.props}
      />

      {/* Floating bulk-action bar — appears once rows are selected */}
      <BulkActionBar selectedCount={selected.size} onClose={() => setSelected(new Set())}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            toast.success(`Exported ${selected.size} users`, {
              description: 'A CSV download would start here.',
            })
            setSelected(new Set())
          }}
        >
          Export CSV
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            toast.success(`Deactivated ${selected.size} users`)
            setSelected(new Set())
          }}
        >
          Deactivate
        </Button>
      </BulkActionBar>
    </div>
  )
}
