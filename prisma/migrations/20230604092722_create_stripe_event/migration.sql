-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "balance" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "StripeEvent" (
    "id" TEXT NOT NULL,

    CONSTRAINT "StripeEvent_pkey" PRIMARY KEY ("id")
);
