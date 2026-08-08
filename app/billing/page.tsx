'use client'

import { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  ConfirmDialog,
  CopyButton,
  DateRangePicker,
  DescriptionItem,
  DescriptionList,
  Drawer,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  FilterBar,
  FilterBarActions,
  FilterBarFilters,
  FilterBarSearch,
  FilterSelect,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  ViewToggle,
  type ViewMode,
} from '@arkite-ui/core'
import { MoreHorizontal } from 'lucide-react'

interface Invoice {
  id: string
  tenant: string
  amount: string
  status: 'paid' | 'pending' | 'overdue'
  issued: string
}

const INVOICES: Invoice[] = [
  { id: 'INV-2093', tenant: 'Northwind Traders', amount: '$1,920', status: 'paid', issued: '2026-08-01' },
  { id: 'INV-2092', tenant: 'Globex', amount: '$9,000', status: 'paid', issued: '2026-08-01' },
  { id: 'INV-2091', tenant: 'Stark Industries', amount: '$4,480', status: 'pending', issued: '2026-07-28' },
  { id: 'INV-2090', tenant: 'Wayne Corp', amount: '$2,480', status: 'overdue', issued: '2026-07-15' },
  { id: 'INV-2089', tenant: 'Initech', amount: '$0', status: 'paid', issued: '2026-07-14' },
  { id: 'INV-2088', tenant: 'Hooli', amount: '$3,840', status: 'pending', issued: '2026-07-12' },
]

const STATUS_VARIANT = { paid: 'success', pending: 'warning', overdue: 'destructive' } as const

export default function BillingPage() {
  const [view, setView] = useState<ViewMode>('table')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [voidTarget, setVoidTarget] = useState<Invoice | null>(null)
  const [viewTarget, setViewTarget] = useState<Invoice | null>(null)

  const rows = useMemo(
    () =>
      INVOICES.filter(
        (inv) =>
          (status === '' || inv.status === status) &&
          (q === '' || `${inv.id} ${inv.tenant}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [q, status]
  )

  const actionsMenu = (inv: Invoice) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Actions for ${inv.id}`}>
          <MoreHorizontal size={15} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => setViewTarget(inv)}>View</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success(`${inv.id}.pdf downloading`)}>
          Download PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => setVoidTarget(inv)}>
          Void invoice…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <TooltipProvider>
    <div className="flex flex-col gap-6">
      <PageHeader title="Billing" description="Invoices across all tenants." />

      <FilterBar>
        <FilterBarSearch placeholder="Search invoice or tenant…" value={q} onChange={setQ} />
        <FilterBarFilters>
          <FilterSelect
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'paid', label: 'Paid' },
              { value: 'pending', label: 'Pending' },
              { value: 'overdue', label: 'Overdue' },
            ]}
          />
          <DateRangePicker size="sm" startLabel="From" endLabel="To" onChange={() => {}} />
        </FilterBarFilters>
        <FilterBarActions>
          <ViewToggle value={view} onChange={setView} />
        </FilterBarActions>
      </FilterBar>

      {rows.length === 0 ? (
        <EmptyState
          variant="search"
          title="No invoices match"
          description="Try clearing the search or status filter."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQ('')
                setStatus('')
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : view === 'table' ? (
        <Card>
          <CardContent>
            <Table compact>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead align="right">Amount</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead stickyAction aria-label="Actions" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-1">
                        {inv.id}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <CopyButton value={inv.id} size="sm" aria-label={`Copy ${inv.id}`} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Copy invoice number</TooltipContent>
                        </Tooltip>
                      </span>
                    </TableCell>
                    <TableCell>{inv.tenant}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[inv.status]}>{inv.status}</Badge>
                    </TableCell>
                    <TableCell numeric>{inv.amount}</TableCell>
                    <TableCell className="text-muted-foreground">{inv.issued}</TableCell>
                    <TableCell stickyAction>{actionsMenu(inv)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((inv) => (
            <Card key={inv.id}>
              <CardHeader title={inv.id} description={inv.tenant} actions={actionsMenu(inv)} />
              <CardContent className="flex items-center justify-between">
                <Badge variant={STATUS_VARIANT[inv.status]}>{inv.status}</Badge>
                <span className="text-lg font-semibold tabular-nums">{inv.amount}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Invoice detail drawer */}
      <Drawer
        open={viewTarget != null}
        onClose={() => setViewTarget(null)}
        title={viewTarget?.id}
        description={viewTarget?.tenant}
        footer={
          <>
            <Button variant="outline" onClick={() => setViewTarget(null)}>
              Close
            </Button>
            <Button onClick={() => toast.success(`${viewTarget?.id}.pdf downloading`)}>
              Download PDF
            </Button>
          </>
        }
      >
        {viewTarget && (
          <div className="space-y-6">
            <DescriptionList divider>
              <DescriptionItem
                label="Invoice"
                value={
                  <span className="inline-flex items-center gap-1">
                    {viewTarget.id}
                    <CopyButton value={viewTarget.id} size="sm" aria-label="Copy invoice number" />
                  </span>
                }
              />
              <DescriptionItem
                label="Status"
                value={<Badge variant={STATUS_VARIANT[viewTarget.status]}>{viewTarget.status}</Badge>}
              />
              <DescriptionItem label="Issued" value={viewTarget.issued} />
              <DescriptionItem
                label="Total"
                value={<span className="font-semibold tabular-nums">{viewTarget.amount}</span>}
              />
            </DescriptionList>

            <div>
              <p className="mb-2 text-sm font-medium">Line items</p>
              <Table compact hoverable={false}>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead align="right">Qty</TableHead>
                    <TableHead align="right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Pro seats</TableCell>
                    <TableCell numeric>24</TableCell>
                    <TableCell numeric>{viewTarget.amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Usage overage</TableCell>
                    <TableCell numeric>—</TableCell>
                    <TableCell numeric>$0</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={voidTarget != null}
        onClose={() => setVoidTarget(null)}
        title={`Void ${voidTarget?.id}?`}
        description="The invoice will be cancelled and the tenant notified. This cannot be undone."
        confirmLabel="Void invoice"
        onConfirm={() => {
          toast.success(`${voidTarget?.id} voided`)
          setVoidTarget(null)
        }}
      />
    </div>
    </TooltipProvider>
  )
}
