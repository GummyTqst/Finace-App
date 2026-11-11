ALTER TABLE "RecurringBill"
  ADD COLUMN "accountId" TEXT,
  ADD COLUMN "categoryId" TEXT,
  ADD COLUMN "lastPaidDate" TIMESTAMP(3),
  ADD COLUMN "nextDueDate" TIMESTAMP(3);

CREATE INDEX "RecurringBill_accountId_idx" ON "RecurringBill"("accountId");
CREATE INDEX "RecurringBill_categoryId_idx" ON "RecurringBill"("categoryId");

ALTER TABLE "RecurringBill"
  ADD CONSTRAINT "RecurringBill_accountId_fkey"
  FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RecurringBill"
  ADD CONSTRAINT "RecurringBill_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
