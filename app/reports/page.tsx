'use client'

import { useMemo, useState } from 'react'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  DataTable,
  FilterBar,
  FilterBarActions,
  FilterBarFilters,
  FilterBarGroup,
  PageHeader,
  SegmentedControl,
  type Column,
} from '@arkite-ui/core'

/**
 * Dense reporting page — the shape a wide table plus preset filters takes.
 *
 * Two things here are easy to get wrong and are the point of this page:
 *
 *  1. The filter row is `FilterBarGroup` + `SegmentedControl`, not a
 *     hand-rolled label span with a flex row of buttons. Narrow the window:
 *     the groups wrap instead of pushing the page sideways.
 *  2. The table declares `minWidth`. Without it a table is `width: 100%` with
 *     auto layout, so it squeezes every column to min-content before it
 *     overflows — columns collapse, headers stack, and the pinned first column
 *     never engages because the table technically "fits".
 */

type Period = '1d' | '7d' | '30d' | '90d'
type Segment = 'all' | 'smb' | 'ent'
type Trend = 'up' | 'down'
type RowCount = '10' | '25' | '50'

interface TenantRow {
  tenant: string
  plan: 'Free' | 'Pro' | 'Enterprise'
  seats: number
  mrr: number
  growth: number
  churnRisk: number
  invoices: number
  openTickets: number
  lastActive: string
}

const TENANTS: TenantRow[] = [
  { tenant: 'Northwind Traders', plan: 'Enterprise', seats: 480, mrr: 24800, growth: 0.124, churnRisk: 0.04, invoices: 36, openTickets: 2, lastActive: '2 min ago' },
  { tenant: 'Contoso Manufacturing', plan: 'Enterprise', seats: 315, mrr: 18950, growth: 0.061, churnRisk: 0.09, invoices: 28, openTickets: 5, lastActive: '18 min ago' },
  { tenant: 'Fabrikam Logistics', plan: 'Pro', seats: 96, mrr: 5760, growth: -0.032, churnRisk: 0.31, invoices: 19, openTickets: 11, lastActive: '3 h ago' },
  { tenant: 'Adventure Works', plan: 'Pro', seats: 74, mrr: 4440, growth: 0.208, churnRisk: 0.06, invoices: 14, openTickets: 1, lastActive: '41 min ago' },
  { tenant: 'Tailspin Toys', plan: 'Pro', seats: 52, mrr: 3120, growth: 0.017, churnRisk: 0.18, invoices: 12, openTickets: 4, lastActive: '1 d ago' },
  { tenant: 'Wide World Importers', plan: 'Free', seats: 12, mrr: 0, growth: -0.115, churnRisk: 0.62, invoices: 0, openTickets: 7, lastActive: '6 d ago' },
  { tenant: 'Lucerne Publishing', plan: 'Pro', seats: 41, mrr: 2460, growth: 0.089, churnRisk: 0.12, invoices: 9, openTickets: 0, lastActive: '5 h ago' },
  { tenant: 'Proseware Health', plan: 'Enterprise', seats: 268, mrr: 16080, growth: 0.143, churnRisk: 0.03, invoices: 31, openTickets: 3, lastActive: '9 min ago' },
]

const money = (v: number) => `$${v.toLocaleString()}`
const pct = (v: number) => `${v >= 0 ? '+' : ''}${(v * 100).toFixed(1)}%`

const planVariant = { Free: 'secondary', Pro: 'info', Enterprise: 'success' } as const

const columns: Column<TenantRow>[] = [
  {
    key: 'tenant',
    header: 'Tenant',
    pinned: 'left',
    cell: (r) => <span className="font-medium">{r.tenant}</span>,
  },
  {
    key: 'plan',
    header: 'Plan',
    cell: (r) => (
      <Badge variant={planVariant[r.plan]} size="sm">
        {r.plan}
      </Badge>
    ),
  },
  { key: 'seats', header: 'Seats', align: 'right', cell: (r) => r.seats.toLocaleString() },
  { key: 'mrr', header: 'MRR', align: 'right', cell: (r) => <span className="font-mono">{money(r.mrr)}</span> },
  {
    key: 'growth',
    header: 'Growth',
    align: 'right',
    cell: (r) => (
      <span className={`font-mono ${r.growth >= 0 ? 'text-success' : 'text-destructive'}`}>
        {pct(r.growth)}
      </span>
    ),
  },
  {
    key: 'churnRisk',
    header: 'Churn risk',
    align: 'right',
    // Discrete grades → cellClassName (a class string), not cellStyle.
    cellClassName: (r) => (r.churnRisk >= 0.3 ? 'bg-destructive-soft font-medium' : ''),
    cell: (r) => <span className="font-mono">{(r.churnRisk * 100).toFixed(0)}%</span>,
  },
  { key: 'invoices', header: 'Invoices', align: 'right', hidden: 'mobile', cell: (r) => r.invoices },
  { key: 'openTickets', header: 'Open tickets', align: 'right', hidden: 'mobile', cell: (r) => r.openTickets },
  {
    key: 'lastActive',
    header: 'Last active',
    align: 'right',
    hidden: 'mobile',
    cell: (r) => <span className="text-muted-foreground">{r.lastActive}</span>,
  },
]

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>('30d')
  const [segment, setSegment] = useState<Segment>('all')
  const [trend, setTrend] = useState<Trend>('up')
  const [rowCount, setRowCount] = useState<RowCount>('25')

  const rows = useMemo(() => {
    const bySegment = TENANTS.filter((t) => {
      if (segment === 'smb') return t.plan !== 'Enterprise'
      if (segment === 'ent') return t.plan === 'Enterprise'
      return true
    })
    const byTrend = bySegment.filter((t) => (trend === 'up' ? t.growth >= 0 : t.growth < 0))
    return byTrend
      .slice()
      .sort((a, b) => (trend === 'up' ? b.growth - a.growth : a.growth - b.growth))
      .slice(0, Number(rowCount))
  }, [segment, trend, rowCount])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports"
        description="Tenant revenue and health. A wide table with preset filters — the layout that needs minWidth."
      />

      <FilterBar>
        <FilterBarFilters>
          <FilterBarGroup label="Period">
            <SegmentedControl
              size="sm"
              value={period}
              onChange={(v) => setPeriod(v as Period)}
              options={[
                { value: '1d', label: '1D' },
                { value: '7d', label: '7D' },
                { value: '30d', label: '30D' },
                { value: '90d', label: '90D' },
              ]}
            />
          </FilterBarGroup>
          <FilterBarGroup label="Segment">
            <SegmentedControl
              size="sm"
              value={segment}
              onChange={(v) => setSegment(v as Segment)}
              options={[
                { value: 'all', label: 'All' },
                { value: 'smb', label: 'SMB' },
                { value: 'ent', label: 'Enterprise' },
              ]}
            />
          </FilterBarGroup>
          <FilterBarGroup label="Trend">
            <SegmentedControl
              size="sm"
              value={trend}
              onChange={(v) => setTrend(v as Trend)}
              options={[
                { value: 'up', label: 'Growing ↑' },
                { value: 'down', label: 'Shrinking ↓' },
              ]}
            />
          </FilterBarGroup>
          <FilterBarGroup label="Rows">
            <SegmentedControl
              size="sm"
              value={rowCount}
              onChange={(v) => setRowCount(v as RowCount)}
              options={[
                { value: '10', label: '10' },
                { value: '25', label: '25' },
                { value: '50', label: '50' },
              ]}
            />
          </FilterBarGroup>
        </FilterBarFilters>
        <FilterBarActions>
          <span className="text-muted-foreground text-xs">
            {rows.length} of {TENANTS.length} tenants
          </span>
        </FilterBarActions>
      </FilterBar>

      {/*
        DataTable already draws its own bordered surface, so it is not wrapped
        in a Card. The Card here exists only to carry the title: padding="none",
        CardContent p-0, and the table's own frame reduced to a top rule.
      */}
      <Card padding="none">
        <CardHeader
          title="Tenant health"
          description="Scroll sideways — the Tenant column stays pinned."
        />
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={rows}
            getRowKey={(r) => r.tenant}
            minWidth={900}
            pagination={false}
            compact
            emptyContent="No tenants match these filters."
            className="rounded-none border-0 border-t"
          />
        </CardContent>
      </Card>
    </div>
  )
}
