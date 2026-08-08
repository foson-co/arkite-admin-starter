import { NextResponse } from 'next/server'
import { queryUsers } from '../../../lib/mock-users'

// Mock API — stands in for your real backend. It receives the query produced
// by `useServerTable` (page / pageSize / sort / filters) and returns one
// pre-processed slice plus the total count: the server does the work, the
// DataTable only renders.

export async function GET(request: Request) {
  const url = new URL(request.url)
  return NextResponse.json(
    queryUsers({
      page: Number(url.searchParams.get('page') ?? 1),
      pageSize: Number(url.searchParams.get('pageSize') ?? 20),
      sortKey: url.searchParams.get('sortKey'),
      sortDir: url.searchParams.get('sortDir'),
      role: url.searchParams.getAll('role'),
    })
  )
}
