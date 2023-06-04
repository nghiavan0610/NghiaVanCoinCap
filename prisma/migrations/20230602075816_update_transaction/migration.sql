/*
  Warnings:

  - You are about to drop the column `coin` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `totalValue` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `coin` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `coinId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coinId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "coin",
DROP COLUMN "totalValue",
ADD COLUMN     "coinId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "coin",
ADD COLUMN     "coinId" TEXT NOT NULL;
