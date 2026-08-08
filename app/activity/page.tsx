'use client'

import { useState } from 'react'
import {
  Badge,
  Card,
  CardContent,
  InfiniteScroll,
  PageHeader,
  SegmentedControl,
} from '@arkite-ui/core'

// Mock activity feed — in your app this is a cursor-paginated API.
interface Activity {
  id: number
  title: string
  detail: string
  kind: 'billing' | 'member' | 'system'
  when: string
}

const KINDS = ['billing', 'member', 'system'] as const
const TITLES: Record<Activity['kind'], string[]> = {
  billing: ['Invoice paid', 'Plan upgraded', 'Card expiring soon', 'Refund issued'],
  member: ['Member invited', 'Member joined', 'Role changed', 'Member removed'],
  system: ['Weekly backup completed', 'Webhook retried', 'API key rotated', 'Export finished'],
}

function makeBatch(offset: number, size: number): Activity[] {
  return Array.from({ length: size }, (_, i) => {
    const id = offset + i + 1
    const kind = KINDS[id % 3]
    return {
      id,
      kind,
      title: TITLES[kind][id % 4],
      detail: `Event #${id} · tenant ${['Acme', 'Northwind', 'Initech'][id % 3]}`,
      when: `${Math.max(1, id % 48)}h ago`,
    }
  })
}

const KIND_VARIANT = { billing: 'default', member: 'success', system: 'secondary' } as const
const TOTAL = 200

export default function ActivityPage() {
  const [items, setItems] = useState<Activity[]>(() => makeBatch(0, 30))
  const [filter, setFilter] = useState<'all' | Activity['kind']>('all')
  const [loadingMore, setLoadingMore] = useState(false)

  const visible = filter === 'all' ? items : items.filter((a) => a.kind === filter)

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <PageHeader
        title="Activity"
        description="Cursor-paginated feed — scroll to the bottom to load more."
      />

      <SegmentedControl
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'All' },
          { value: 'billing', label: 'Billing' },
          { value: 'member', label: 'Members' },
          { value: 'system', label: 'System' },
        ]}
      />

      <Card>
        <CardContent>
          <InfiniteScroll
            items={visible}
            getItemKey={(a) => a.id}
            height="60vh"
            estimateSize={64}
            hasMore={items.length < TOTAL}
            loadingMore={loadingMore}
            onLoadMore={() => {
              setLoadingMore(true)
              // Simulated network latency — swap for your cursor fetch
              setTimeout(() => {
                setItems((prev) => [...prev, ...makeBatch(prev.length, 30)])
                setLoadingMore(false)
              }, 400)
            }}
            renderItem={(a) => (
              <div className="flex items-center justify-between gap-4 border-b py-3 pr-4 text-sm">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-muted-foreground">{a.detail}</p>
                </div>
                <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                  {a.when}
                  <Badge variant={KIND_VARIANT[a.kind]}>{a.kind}</Badge>
                </span>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}
