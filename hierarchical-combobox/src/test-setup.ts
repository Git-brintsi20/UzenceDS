/**
 * Vitest setup — runs before every test file.
 *
 * We intentionally do NOT import @testing-library/jest-dom here because
 * @storybook/test hoists jest-dom v6 which has an ESM-only transitive
 * dependency (@csstools/css-calc) that breaks vitest's forks pool
 * on Node 20.18 (require() of .mjs not supported).
 *
 * Tests use vitest's native assertions instead (toBeTruthy, toBeFalsy, etc.).
 */
/// <reference types="vitest/globals" />
