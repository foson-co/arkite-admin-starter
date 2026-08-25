// 本地 ESLint 設定（Ark 前端規範 §5.5：各專案自行定義，不引用共享 config）。
//
// 這個 repo 是**範本**，被複製出去的東西會一路傳下去——所以它帶的不只是規則，
// 還有「規則要有閘門」這件事本身：lint 進 CI，warning 上限為 0。
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

// ⚠️ 安裝時 pnpm 會對 eslint-plugin-jsx-a11y 印一則 unmet peer 警告（它宣告
// eslint ^3–^9，我們用 10）。**已實測無害**：alt-text、click-events-have-key-events、
// no-static-element-interactions、anchor-is-valid 在 eslint 10 下都正常觸發。
// 不要為了消警告而退回 eslint 9——9.x 已是 maintenance 且 npm 標示
// "no longer supported"，把範本釘在不再支援的版本上比一則警告嚴重得多。

export default tseslint.config(
  {
    ignores: ['.next/', 'out/', 'node_modules/', 'next-env.d.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // 設定檔跑在 Node 上（next.config.mjs 讀 process.env），不給 node globals
    // 會被 no-undef 判成 'process' is not defined。
    files: ['**/*.{mjs,cjs,js}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // §5.5：這一條是 error，不是 warn
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  }
)
