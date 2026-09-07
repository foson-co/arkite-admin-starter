import { describe, expect, it } from 'vitest'

import { GET } from './route'

/**
 * Route Handler 的責任只有一件:把 query string 翻譯成 `queryUsers` 的參數。
 * 這裡釘的是那層翻譯——尤其是**預設值**與**多值參數**,兩者都是照抄範本的人
 * 最容易在接真後端時弄丟的東西。
 */
const call = (qs: string) => GET(new Request(`http://localhost/api/users${qs}`))

describe('GET /api/users', () => {
  it('沒帶參數時用預設分頁(page=1, pageSize=20)', async () => {
    const body = await (await call('')).json()
    expect(body.rows).toHaveLength(20)
    expect(body.rows[0].id).toBe(1)
    expect(body.total).toBe(137)
  })

  it('page / pageSize 由 query string 生效', async () => {
    const body = await (await call('?page=2&pageSize=5')).json()
    expect(body.rows).toHaveLength(5)
    expect(body.rows[0].id).toBe(6)
  })

  it('role 可重複出現,收成陣列', async () => {
    // getAll 而非 get:寫成 get 的話第二個 role 會被靜默丟掉,
    // 而畫面上多選過濾器看起來仍然「有反應」——最難察覺的一種壞法。
    const body = await (await call('?pageSize=200&role=Admin&role=Editor')).json()
    const roles = new Set(body.rows.map((u: { role: string }) => u.role))
    expect(roles).toEqual(new Set(['Admin', 'Editor']))
  })

  it('排序參數會傳到查詢層', async () => {
    const body = await (await call('?pageSize=3&sortKey=name&sortDir=desc')).json()
    expect(body.rows[0].name).toBe('User 137')
  })

  it('回應是 JSON 且帶 total', async () => {
    const res = await call('')
    expect(res.headers.get('content-type')).toContain('application/json')
    expect(await res.json()).toHaveProperty('total')
  })
})
