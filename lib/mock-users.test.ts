import { describe, expect, it } from 'vitest'

import { DB, queryUsers } from './mock-users'

/**
 * `queryUsers` 是本範本示範「server 端做完分頁/排序/篩選、DataTable 只負責渲染」
 * 的那一半。它會被照抄成真實專案的查詢層,所以這裡釘的是**契約**,
 * 不是實作細節。
 */
describe('queryUsers', () => {
  it('回傳的是該頁的切片,不是整份資料', () => {
    const { rows } = queryUsers({ page: 1, pageSize: 20 })
    expect(rows).toHaveLength(20)
    expect(rows[0]?.id).toBe(1)
  })

  it('換頁會拿到不同的切片', () => {
    const p1 = queryUsers({ page: 1, pageSize: 20 }).rows.map((u) => u.id)
    const p2 = queryUsers({ page: 2, pageSize: 20 }).rows.map((u) => u.id)
    expect(p2[0]).toBe(21)
    expect(p1).not.toEqual(p2)
  })

  it('最後一頁不足額時只回剩下的', () => {
    // 137 筆、每頁 20 ⇒ 第 7 頁剩 17 筆。寫死 137/17 而不是用 DB.length 算——
    // 用實作自己的常數去算期望值,實作改壞時斷言會跟著壞。
    expect(DB).toHaveLength(137)
    expect(queryUsers({ page: 7, pageSize: 20 }).rows).toHaveLength(17)
  })

  it('total 是**篩選後**的筆數,不是資料表總數', () => {
    // 最容易寫錯的一條:篩選了卻回傳 DB.length,分頁器就會顯示不存在的頁數。
    const all = queryUsers({ page: 1, pageSize: 20 })
    const admins = queryUsers({ page: 1, pageSize: 20, role: ['Admin'] })
    expect(all.total).toBe(137)
    expect(admins.total).toBeLessThan(all.total)
    expect(admins.rows.every((u) => u.role === 'Admin')).toBe(true)
  })

  it('多選篩選是聯集', () => {
    const two = queryUsers({ page: 1, pageSize: 200, role: ['Admin', 'Editor'] })
    expect(two.rows.every((u) => u.role === 'Admin' || u.role === 'Editor')).toBe(true)
    expect(two.total).toBe(
      queryUsers({ page: 1, pageSize: 200, role: ['Admin'] }).total +
        queryUsers({ page: 1, pageSize: 200, role: ['Editor'] }).total
    )
  })

  it('空的 role 陣列等於不篩選', () => {
    expect(queryUsers({ page: 1, pageSize: 20, role: [] }).total).toBe(137)
  })

  it('排序:asc 與 desc 互為反向', () => {
    const asc = queryUsers({ page: 1, pageSize: 5, sortKey: 'name', sortDir: 'asc' }).rows
    const desc = queryUsers({ page: 1, pageSize: 5, sortKey: 'name', sortDir: 'desc' }).rows
    expect(asc[0]?.name).toBe('User 001')
    expect(desc[0]?.name).toBe('User 137')
    expect(asc[0]?.id).not.toBe(desc[0]?.id)
  })

  it('排序不得污染共用的 DB', () => {
    // 經典缺陷:對來源陣列就地 sort,於是「排過一次之後,沒帶排序的查詢也變了樣」。
    const before = DB.map((u) => u.id)
    queryUsers({ page: 1, pageSize: 20, sortKey: 'name', sortDir: 'desc' })
    expect(DB.map((u) => u.id)).toEqual(before)
  })

  it('sortKey 給了但 sortDir 沒給時不排序', () => {
    const rows = queryUsers({ page: 1, pageSize: 5, sortKey: 'name', sortDir: null }).rows
    expect(rows.map((u) => u.id)).toEqual([1, 2, 3, 4, 5])
  })
})
