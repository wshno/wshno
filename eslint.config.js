import { base, ignores, node, react } from '@wshno/eslint-config'

// @wshno/eslint-config: JS/TS and SonarJS recommended, @eslint-react (incl. the hooks rules) with
// React Refresh. Node globals for the Vite config.
/** @type {import('eslint').Linter.Config[]} */
export default [...ignores, ...base, ...react, ...node.map((c) => ({ ...c, files: ['vite.config.ts', 'eslint.config.js'] }))]
