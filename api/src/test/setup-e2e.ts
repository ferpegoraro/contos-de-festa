process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://test:test@localhost:5432/test";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-for-e2e-tests-32";
process.env.ADMIN_REGISTRATION_KEY =
  process.env.ADMIN_REGISTRATION_KEY ?? "test-admin-key-1234";
if (!process.env.NODE_ENV) {
  (process.env as Record<string, string>).NODE_ENV = "test";
}
process.env.CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME ?? "test-cloud";
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY ?? "test-key";
process.env.CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET ?? "test-secret";
process.env.FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";
