import { z } from 'zod'

/**
 * 環境變數的單一入口（Ark 前端規範 §5.4）。
 *
 * 直接讀 `process.env` 的問題是「缺漏或格式錯誤在執行到那一行時才炸」——
 * 而那可能是使用者點下去的當下。經 schema 驗證之後，錯誤發生在模組載入時。
 *
 * ⚠️ 這裡必須**逐一寫出** `process.env.NEXT_PUBLIC_X`。Next.js 是在 build 時對
 * 這個字面樣式做替換，不是在執行期提供一個真的 `process.env` 物件——所以
 * `schema.parse(process.env)` 或 `process.env[name]` 這種動態存取在瀏覽器端
 * 一律拿到 undefined。新增變數時要同時加到 schema 與下面的物件字面值兩處。
 */
const schema = z.object({
  /** 靜態匯出的展示站沒有 server，直接在瀏覽器呼叫 mock；真實 app 走 fetch。 */
  NEXT_PUBLIC_STATIC_DEMO: z.enum(['0', '1']).default('0'),
})

const parsed = schema.safeParse({
  NEXT_PUBLIC_STATIC_DEMO: process.env.NEXT_PUBLIC_STATIC_DEMO,
})

if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`)
}

export const env = parsed.data
