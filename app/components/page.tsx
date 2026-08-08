'use client'

import { useState } from 'react'
import {
  Alert,
  Breadcrumb,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  ColorPicker,
  Combobox,
  CollapsibleSection,
  DatePicker,
  Divider,
  EmptyState,
  ErrorState,
  InlineCode,
  Kbd,
  NumberInput,
  PageHeader,
  PasswordInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  SearchInput,
  Skeleton,
  Spinner,
  Steps,
  TagInput,
  Button,
  VirtualList,
  toast,
} from '@arkite-ui/core'

// A deliberately honest page: not a business screen, a browsable gallery of
// the primitives the other pages don't reach. Every block is copy-pasteable.

const BIG_LIST = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  label: `Row ${i + 1} of 10,000 — virtualized, only visible rows render`,
}))

export default function ComponentsPage() {
  const [amount, setAmount] = useState<number | null>(42)
  const [date, setDate] = useState<Date | null>(null)
  const [role, setRole] = useState<string | string[]>('editor')
  const [tags, setTags] = useState<string[]>(['alpha', 'beta'])
  const [color, setColor] = useState('#6a4dff')

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Component gallery"
        description={
          <>
            The primitives the other pages don&apos;t reach — every block maps to one import from{' '}
            <InlineCode>@arkite-ui/core</InlineCode>.
          </>
        }
      />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Library' },
          { label: 'Components' },
        ]}
      />

      <CollapsibleSection title="Inputs" description="Form controls beyond Input/Select" defaultOpen>
        <div className="grid gap-6 py-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">SearchInput (debounced)</p>
            <SearchInput
              placeholder="Type to search…"
              debounce={300}
              onDebouncedChange={(v) => v && toast.info(`Searching "${v}"`)}
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">NumberInput</p>
            <NumberInput value={amount} onChange={setAmount} min={0} max={100} suffix="%" />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">DatePicker</p>
            <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Combobox</p>
            <Combobox
              value={role}
              onChange={setRole}
              options={[
                { value: 'admin', label: 'Admin', description: 'Full access' },
                { value: 'editor', label: 'Editor', description: 'Can edit content' },
                { value: 'viewer', label: 'Viewer', description: 'Read-only' },
              ]}
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">TagInput</p>
            <TagInput value={tags} onChange={setTags} placeholder="Add tag…" max={6} />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">ColorPicker</p>
            <ColorPicker value={color} onChange={setColor} presets={['#6a4dff', '#0ea5e9', '#16a34a', '#dc2626']} />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">PasswordInput</p>
            <PasswordInput placeholder="••••••••" />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">Checkbox / RadioGroup / Kbd</p>
            <Checkbox label="Email me on failures" description="Only critical ones" defaultChecked />
            <RadioGroup
              name="digest"
              orientation="horizontal"
              defaultValue="weekly"
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'never', label: 'Never' },
              ]}
            />
            <p className="text-sm text-muted-foreground">
              Save with <Kbd>⌘</Kbd> + <Kbd>S</Kbd>
            </p>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Feedback" description="States, loaders, and messages">
        <div className="grid gap-6 py-4 sm:grid-cols-2">
          <div className="space-y-3">
            <Alert variant="info">Heads up — this workspace is on a trial plan.</Alert>
            <Alert variant="destructive" dismissible onClose={() => toast.info('Dismissed')}>
              Payment failed twice; the tenant was notified.
            </Alert>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">Skeleton / Spinner / Progress</p>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rounded" height={40} />
            <div className="flex items-center gap-4">
              <Spinner size="sm" />
              <Spinner size="md" />
              <div className="flex-1">
                <Progress indeterminate aria-label="Working" />
              </div>
            </div>
          </div>
          <EmptyState
            size="sm"
            variant="no-data"
            title="Nothing here yet"
            description="EmptyState with an action slot."
            action={<Button size="sm">Create one</Button>}
          />
          <ErrorState
            size="sm"
            title="Failed to load"
            description="ErrorState with a retry handler."
            onRetry={() => toast.success('Retried!')}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Structure" description="Wayfinding and composition">
        <div className="grid gap-6 py-4 sm:grid-cols-2">
          <div className="space-y-4">
            <Steps
              size="sm"
              currentStep={1}
              steps={[
                { label: 'Account', description: 'Basics' },
                { label: 'Workspace', description: 'Name & plan' },
                { label: 'Invite', description: 'Teammates' },
              ]}
            />
            <Divider label="or" />
            <p className="text-sm text-muted-foreground">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    Open popover
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 text-sm">
                  Anchored content — for hints richer than a tooltip.
                </PopoverContent>
              </Popover>
            </p>
          </div>
          <Calendar defaultValue={new Date(2026, 7, 8)} onSelect={() => {}} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Scale" description="10,000 rows, virtualized">
        <Card className="mt-4">
          <CardHeader
            title="VirtualList"
            description="Only the visible slice renders — scroll is instant."
          />
          <CardContent>
            <VirtualList
              items={BIG_LIST}
              getItemKey={(r) => r.id}
              height={280}
              estimateSize={40}
              aria-label="Virtualized demo list"
              renderItem={(r) => (
                <div className="flex items-center justify-between border-b py-2 pr-3 text-sm">
                  <span>{r.label}</span>
                  <InlineCode>#{r.id}</InlineCode>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </CollapsibleSection>
    </div>
  )
}
