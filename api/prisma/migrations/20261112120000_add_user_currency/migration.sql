-- Keep the user's selected currency in sync with the Prisma schema.
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'EUR';
