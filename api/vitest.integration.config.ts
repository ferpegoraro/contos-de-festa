import { defineConfig } from "vitest/config";

/**
 * Testes de integração — rodam contra o Postgres real (docker-compose)
 * em um schema efêmero. Separados da suíte unitária/e2e (vitest.config.ts).
 *
 *   npm run test:integration
 */
export default defineConfig({
  test: {
    root: __dirname,
    include: ["src/**/*.int-spec.ts"],
    environment: "node",
    globals: false,
    setupFiles: ["src/test/setup-integration.ts"],
    fileParallelism: false,
    hookTimeout: 60_000,
    testTimeout: 30_000,
  },
});
