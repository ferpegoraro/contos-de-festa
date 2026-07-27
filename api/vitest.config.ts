import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: __dirname,
    include: ["src/**/*.spec.ts", "src/**/*.e2e-spec.ts"],
    exclude: ["**/node_modules/**", "src/**/*.int-spec.ts"],
    environment: "node",
    globals: false,
    clearMocks: true,
    setupFiles: ["src/test/setup-e2e.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.spec.ts",
        "src/**/*.e2e-spec.ts",
        "src/test/**",
        "src/repositories/in-memory/**",
        "src/repositories/prisma/**",
        "src/http/**",
        "src/lib/**",
        "src/server.ts",
        "src/app.ts",
        "src/env/**",
        "src/@types/**",
      ],
    },
  },
});
