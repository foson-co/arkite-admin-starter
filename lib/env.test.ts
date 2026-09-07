import { afterEach, describe, expect, it, vi } from 'vitest'

/**
 * §5.4 要求環境變數經 schema 驗證。這一組測試的用途是證明那個驗證**真的會擋**
 * ——一個 parse 完就丟掉結果的 schema 也能讓「有沒有用 zod」的靜態檢查通過。
 *
 * 每條都 resetModules + 動態 import:env.ts 是在**模組載入時**求值的,
 * 沿用同一份 module cache 的話第二條之後都拿到第一條的結果。
 */
afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

const loadEnv = async () => (await import('./env')).env

describe('env', () => {
  it('未設定時給預設值 "0"', async () => {
    vi.stubEnv('NEXT_PUBLIC_STATIC_DEMO', undefined)
    expect((await loadEnv()).NEXT_PUBLIC_STATIC_DEMO).toBe('0')
  })

  it('合法值原樣通過', async () => {
    vi.stubEnv('NEXT_PUBLIC_STATIC_DEMO', '1')
    expect((await loadEnv()).NEXT_PUBLIC_STATIC_DEMO).toBe('1')
  })

  it('不合法的值在模組載入時就炸,不是等到用到才炸', async () => {
    // 這是 §5.4 的整個重點。少了這一條,上面兩條在「schema 從不拒絕任何東西」
    // 的世界裡也會全綠。
    vi.stubEnv('NEXT_PUBLIC_STATIC_DEMO', 'yes')
    await expect(loadEnv()).rejects.toThrow(/Invalid environment variables/)
  })
})
