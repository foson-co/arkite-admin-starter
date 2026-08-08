'use client'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  PageHeader,
  Sparkline,
  StatCard,
  StatGroup,
  Timeline,
} from '@arkite-ui/core'

// Static demo numbers — replace with data from your API / server components.
const revenue = [8, 11, 9, 14, 12, 16, 19, 17, 22, 24, 21, 28]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Everything on this page is @arkite-ui/core — no custom CSS."
      />

      <StatGroup columns={4}>
        <StatCard variant="bordered" label="MRR" value="$24.8k" trend="up" change="+12.4%" />
        <StatCard variant="bordered" label="Active tenants" value="128" trend="up" change="+6" />
        <StatCard variant="bordered" label="Open tickets" value="9" trend="down" change="-3" />
        <StatCard
          variant="bordered"
          label="Revenue trend"
          value={<Sparkline data={revenue} trend="up" width={120} height={36} />}
          helpText="Last 12 weeks"
        />
      </StatGroup>

      <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader title="Recent activity" />
        <CardContent>
          <Timeline
            items={[
              { title: 'Tenant "Northwind" upgraded to Pro', description: '2 hours ago' },
              { title: 'Weekly backup completed', description: '6 hours ago', variant: 'muted' },
              { title: 'New member joined: kai@northwind.io', description: 'Yesterday' },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Explore this starter" />
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              Server-driven tables — <Button variant="link" onClick={() => (location.href = './users/')}>open Users</Button>
            </li>
            <li>
              Form patterns and toasts — <Button variant="link" onClick={() => (location.href = './settings/')}>open Settings</Button>
            </li>
            <li>
              Resize the window: below <code className="text-xs">md</code> the sidebar becomes bottom tabs.
            </li>
          </ul>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
