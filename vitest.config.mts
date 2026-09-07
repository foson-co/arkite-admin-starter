import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // node 環境即可:本範本目前的測試都是純邏輯與 Route Handler,
    // 沒有需要 DOM 的元件測試。要加元件測試時再引入 jsdom + @testing-library/react,
    // 不預先裝一堆用不到的東西進範本(它會被每個照抄的專案繼承)。
    environment: 'node',
    include: ['{app,lib}/**/*.test.{ts,tsx}'],
  },
})
