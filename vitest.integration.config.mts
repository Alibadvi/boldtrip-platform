import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
export default defineConfig({ plugins: [tsconfigPaths()], test: { environment: 'node', include: ['tests/integration/**/*.test.ts'], testTimeout: 60000, hookTimeout: 120000, fileParallelism: false } })
