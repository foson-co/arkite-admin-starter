'use client'

import {
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
        <StatCard label="MRR" value="$24.8k" trend="up" change="+12.4%" />
        <StatCard label="Active tenants" value="128" trend="up" change="+6" />
        <StatCard label="Open tickets" value="9" trend="down" change="-3" />
        <StatCard
          label="Revenue trend"
          value={<Sparkline data={revenue} trend="up" width={120} height={36} />}
          helpText="Last 12 weeks"
        />
      </StatGroup>

      <Card>
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
    </div>
  )
}
