'use client'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  PageHeader,
  Progress,
  Sparkline,
  StatCard,
  StatGroup,
  StatusDot,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Timeline,
} from '@arkite-ui/core'

// Static demo numbers — replace with data from your API / server components.
const revenue = [8, 11, 9, 14, 12, 16, 19, 17, 22, 24, 21, 28]

const services = [
  { name: 'API gateway', status: 'online', latency: '38ms' },
  { name: 'Background jobs', status: 'online', latency: '—' },
  { name: 'Webhooks', status: 'busy', latency: '412ms' },
  { name: 'Search index', status: 'online', latency: '51ms' },
] as const

const signups = [
  { tenant: 'Northwind Traders', plan: 'Pro', seats: 24, mrr: '$1,920' },
  { tenant: 'Globex', plan: 'Enterprise', seats: 180, mrr: '$9,000' },
  { tenant: 'Initech', plan: 'Free', seats: 3, mrr: '$0' },
  { tenant: 'Stark Industries', plan: 'Pro', seats: 56, mrr: '$4,480' },
  { tenant: 'Wayne Corp', plan: 'Pro', seats: 31, mrr: '$2,480' },
] as const

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
        <Card>
          <CardHeader title="Service status" />
          <CardContent>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <StatusDot
                      status={s.status === 'online' ? 'online' : 'busy'}
                      pulse={s.status === 'busy'}
                    />
                    {s.name}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-2">
                    {s.latency}
                    <Badge variant={s.status === 'online' ? 'success' : 'warning'}>
                      {s.status}
                    </Badge>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Plan usage" />
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>API calls</span>
                <span className="text-muted-foreground">1.24M / 2M</span>
              </div>
              <Progress value={62} aria-label="API calls" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span className="text-muted-foreground">18.2 / 20 GB</span>
              </div>
              <Progress value={91} aria-label="Storage" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Seats</span>
                <span className="text-muted-foreground">128 / 200</span>
              </div>
              <Progress value={64} aria-label="Seats" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Explore this starter" />
          <CardContent>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                Server-driven tables —{' '}
                <Button variant="link" onClick={() => (location.href = './users/')}>
                  open Users
                </Button>
              </li>
              <li>
                Form patterns and toasts —{' '}
                <Button variant="link" onClick={() => (location.href = './settings/')}>
                  open Settings
                </Button>
              </li>
              <li>
                Resize the window: below <code className="text-xs">md</code> the sidebar becomes
                bottom tabs.
              </li>
              <li>
                The table below is the lightweight <code className="text-xs">Table</code> family —
                read-only lists don&apos;t need <code className="text-xs">DataTable</code>.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Latest signups" />
          <CardContent>
            <Table compact>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead align="right">Seats</TableHead>
                  <TableHead align="right">MRR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signups.map((s) => (
                  <TableRow key={s.tenant}>
                    <TableCell className="font-medium">{s.tenant}</TableCell>
                    <TableCell>
                      <Badge variant={s.plan === 'Enterprise' ? 'default' : 'secondary'}>
                        {s.plan}
                      </Badge>
                    </TableCell>
                    <TableCell numeric>{s.seats}</TableCell>
                    <TableCell numeric>{s.mrr}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Recent activity"
            actions={
              <Button variant="link" onClick={() => (location.href = './activity/')}>
                View all →
              </Button>
            }
          />
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
    </div>
  )
}
