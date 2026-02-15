import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Vitest configuration — separate from vite.config.ts to avoid
 * the "test" property not existing in Vite 7's defineConfig type.
 *
 * Environment: happy-dom
 * ──────────────────────
 * We use happy-dom instead of jsdom because jsdom v27 pulls in
 * cssstyle → @asamuzakjp/css-color → @csstools/css-calc (ESM-only),
 * which crashes Vitest's forks pool on Node 20.18 with:
 *   "require() of ES Module … not supported"
 *
 * happy-dom doesn't have this dependency chain, is ~3× faster
 * than jsdom, and provides the same DOM API surface needed for
 * @testing-library/react.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test-setup.ts',
    css: false,
  },
});
