'use client'

import { useEffect, useState } from 'react'
import {
  Badge,
  BulkActionBar,
  Button,
  DataTable,
  DescriptionItem,
  DescriptionList,
  Drawer,
  FormControl,
  FormField,
  Input,
  Modal,
  PageHeader,
  Select,
  toast,
  useServerTable,
  type Column,
} from '@arkite-ui/core'

import { env } from '../../lib/env'
import { queryUsers, type User } from '../../lib/mock-users'

// The hosted live demo is a static export with no server — it calls the mock
// directly in the browser. Your real app keeps the fetch path only.
const IS_STATIC_DEMO = env.NEXT_PUBLIC_STATIC_DEMO === '1'

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
  const [detail, setDetail] = useState<User | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let cancelled = false
    // 這是「查詢條件變了就重新抓」的 effect，把 loading 旗標立刻打開是它的正確
    // 行為——規則針對的是用 effect 從既有 state 推導出新 state 的那種串聯渲染。
    // 若要完全免除這條規則，做法是改用查詢函式庫（TanStack Query 之類）由它
    // 管理 loading；這個範本刻意不帶那個相依，所以保留 effect 並在此說明。
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
            ...(query.sortKey
              ? ([
                  ['sortKey', query.sortKey],
                  ['sortDir', query.sortDir!],
                ] as [string, string][])
              : []),
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
      <PageHeader
        title="Users"
        description="Server-side pagination, sorting, and filtering."
        actions={<Button onClick={() => setCreateOpen(true)}>New user</Button>}
      />

      {/* Form dialog: Modal onSubmit wraps everything in a real <form>, so the
          footer submit button reaches the fields — no form="id" plumbing */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New user"
        description="They'll receive an invitation email."
        onSubmit={async (e) => {
          e.preventDefault()
          const form = new FormData(e.currentTarget)
          setCreating(true)
          try {
            await new Promise((r) => setTimeout(r, 400)) // wire your API here
            toast.success('User created', { description: String(form.get('email')) })
            setCreateOpen(false)
          } catch (err) {
            toast.fromError(err, { prefix: 'Failed to create user' })
          } finally {
            setCreating(false)
          }
        }}
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={creating}>
              Create user
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* FormField label shorthand (0.15) — renders a wired FormLabel */}
          <FormField name="name" label="Full name" required>
            <FormControl>
              <Input name="name" required placeholder="Kai Chen" />
            </FormControl>
          </FormField>
          <FormField name="email" label="Email" required>
            <FormControl>
              <Input name="email" type="email" required placeholder="kai@example.com" />
            </FormControl>
          </FormField>
          <FormField name="role" label="Role">
            <FormControl>
              <Select
                name="role"
                defaultValue="viewer"
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'editor', label: 'Editor' },
                  { value: 'viewer', label: 'Viewer' },
                ]}
              />
            </FormControl>
          </FormField>
        </div>
      </Modal>
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
        onRowClick={(u) => setDetail(u)}
        rowClassName={(u) => (u.status === 'inactive' ? 'opacity-60' : '')}
        {...table.props}
      />

      {/* Row click -> side detail drawer: the most common admin navigation */}
      <Drawer
        open={detail != null}
        onClose={() => setDetail(null)}
        title={detail?.name}
        description={detail?.email}
        footer={
          <>
            <Button variant="outline" onClick={() => setDetail(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                toast.success(`Invitation re-sent to ${detail?.email}`)
                setDetail(null)
              }}
            >
              Re-send invite
            </Button>
          </>
        }
      >
        {detail && (
          <DescriptionList divider>
            <DescriptionItem label="ID" value={`#${detail.id}`} />
            <DescriptionItem label="Role" value={detail.role} />
            <DescriptionItem
              label="Status"
              value={
                <Badge variant={detail.status === 'active' ? 'success' : 'secondary'}>
                  {detail.status}
                </Badge>
              }
            />
            <DescriptionItem label="Email" value={detail.email} />
            <DescriptionItem label="Joined" value="2026-03-14" />
          </DescriptionList>
        )}
      </Drawer>

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
