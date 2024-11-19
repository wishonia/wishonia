/*
  Warnings:

  - You are about to drop the column `currency` on the `ApiEndpointPricing` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ApiEndpointPricing` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ApiEndpointPricing` table. All the data in the column will be lost.
  - The primary key for the `ApiEndpointUsage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `ApiEndpointUsage` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `ApiEndpointUsage` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ApiEndpointUsage` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `lastUsedAt` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `requestPerDay` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `requestPerMinute` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `requestPerMonth` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `StripeCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `StripeCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStatus` on the `StripeCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `StripeCustomer` table. All the data in the column will be lost.
  - You are about to drop the `BillingUsage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StripePrice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StripeProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StripeSubscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StripeUsageRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionFeature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApiEndpointUsage" DROP CONSTRAINT "ApiEndpointUsage_endpointPricingId_fkey";

-- DropForeignKey
ALTER TABLE "ApiEndpointUsage" DROP CONSTRAINT "ApiEndpointUsage_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "ApiRequest" DROP CONSTRAINT "ApiRequest_apiKeyId_fkey";

-- DropForeignKey
ALTER TABLE "BillingUsage" DROP CONSTRAINT "BillingUsage_userId_fkey";

-- DropForeignKey
ALTER TABLE "StripePrice" DROP CONSTRAINT "StripePrice_productId_fkey";

-- DropForeignKey
ALTER TABLE "StripeSubscription" DROP CONSTRAINT "StripeSubscription_customerId_fkey";

-- DropForeignKey
ALTER TABLE "StripeSubscription" DROP CONSTRAINT "StripeSubscription_priceId_fkey";

-- DropForeignKey
ALTER TABLE "StripeUsageRecord" DROP CONSTRAINT "StripeUsageRecord_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionFeature" DROP CONSTRAINT "SubscriptionFeature_subscriptionId_fkey";

-- DropIndex
DROP INDEX "ApiEndpointPricing_endpoint_method_key";

-- DropIndex
DROP INDEX "ApiEndpointUsage_endpointPricingId_subscriptionId_period_key";

-- DropIndex
DROP INDEX "ApiEndpointUsage_period_idx";

-- DropIndex
DROP INDEX "ApiKey_key_idx";

-- DropIndex
DROP INDEX "ApiKey_key_key";

-- DropIndex
DROP INDEX "ApiRequest_apiKeyId_idx";

-- DropIndex
DROP INDEX "ApiRequest_createdAt_idx";

-- DropIndex
DROP INDEX "ApiRequest_endpoint_method_idx";

-- AlterTable
ALTER TABLE "ApiEndpointPricing" DROP COLUMN "currency",
DROP COLUMN "description",
DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "ApiEndpointUsage" DROP CONSTRAINT "ApiEndpointUsage_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD CONSTRAINT "ApiEndpointUsage_pkey" PRIMARY KEY ("endpointPricingId", "subscriptionId", "period");

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "expiresAt",
DROP COLUMN "isActive",
DROP COLUMN "key",
DROP COLUMN "lastUsedAt",
DROP COLUMN "requestPerDay",
DROP COLUMN "requestPerMinute",
DROP COLUMN "requestPerMonth";

-- AlterTable
ALTER TABLE "StripeCustomer" DROP COLUMN "createdAt",
DROP COLUMN "subscriptionId",
DROP COLUMN "subscriptionStatus",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "BillingUsage";

-- DropTable
DROP TABLE "StripePrice";

-- DropTable
DROP TABLE "StripeProduct";

-- DropTable
DROP TABLE "StripeSubscription";

-- DropTable
DROP TABLE "StripeUsageRecord";

-- DropTable
DROP TABLE "SubscriptionFeature";

-- DropEnum
DROP TYPE "PriceInterval";

-- DropEnum
DROP TYPE "PriceType";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeCustomerId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_stripeCustomerId_fkey" FOREIGN KEY ("stripeCustomerId") REFERENCES "StripeCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
