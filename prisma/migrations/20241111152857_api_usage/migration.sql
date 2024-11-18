/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('ONE_TIME', 'RECURRING');

-- CreateEnum
CREATE TYPE "PriceInterval" AS ENUM ('DAY', 'WEEK', 'MONTH', 'YEAR');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'CANCELED', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'PAST_DUE', 'UNPAID', 'PAUSED');

-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "lastUsedAt" TIMESTAMP(3),
ADD COLUMN     "requestPerDay" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "requestPerMinute" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "requestPerMonth" INTEGER NOT NULL DEFAULT 10000;

-- CreateTable
CREATE TABLE "ApiEndpointPricing" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "pricePerRequest" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ApiEndpointPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiEndpointUsage" (
    "id" TEXT NOT NULL,
    "endpointPricingId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "billableAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "period" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiEndpointUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiRequest" (
    "id" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "billable" BOOLEAN NOT NULL DEFAULT true,
    "error" TEXT,
    "endpointPricingId" TEXT,
    "billedAmount" DOUBLE PRECISION,

    CONSTRAINT "ApiRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeCustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "subscriptionStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "billableAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "invoiced" BOOLEAN NOT NULL DEFAULT false,
    "invoiceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripePrice" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "currency" TEXT NOT NULL,
    "type" "PriceType" NOT NULL DEFAULT 'ONE_TIME',
    "unitAmount" INTEGER,
    "interval" "PriceInterval",
    "intervalCount" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeSubscription" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canceledAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeUsageRecord" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeUsageRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionFeature" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiEndpointPricing_endpoint_method_key" ON "ApiEndpointPricing"("endpoint", "method");

-- CreateIndex
CREATE INDEX "ApiEndpointUsage_period_idx" ON "ApiEndpointUsage"("period");

-- CreateIndex
CREATE UNIQUE INDEX "ApiEndpointUsage_endpointPricingId_subscriptionId_period_key" ON "ApiEndpointUsage"("endpointPricingId", "subscriptionId", "period");

-- CreateIndex
CREATE INDEX "ApiRequest_apiKeyId_idx" ON "ApiRequest"("apiKeyId");

-- CreateIndex
CREATE INDEX "ApiRequest_createdAt_idx" ON "ApiRequest"("createdAt");

-- CreateIndex
CREATE INDEX "ApiRequest_endpoint_method_idx" ON "ApiRequest"("endpoint", "method");

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_userId_key" ON "StripeCustomer"("userId");

-- CreateIndex
CREATE INDEX "BillingUsage_userId_idx" ON "BillingUsage"("userId");

-- CreateIndex
CREATE INDEX "BillingUsage_period_idx" ON "BillingUsage"("period");

-- CreateIndex
CREATE UNIQUE INDEX "BillingUsage_userId_period_key" ON "BillingUsage"("userId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionFeature_subscriptionId_feature_key" ON "SubscriptionFeature"("subscriptionId", "feature");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "ApiKey_key_idx" ON "ApiKey"("key");

-- AddForeignKey
ALTER TABLE "ApiEndpointUsage" ADD CONSTRAINT "ApiEndpointUsage_endpointPricingId_fkey" FOREIGN KEY ("endpointPricingId") REFERENCES "ApiEndpointPricing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiEndpointUsage" ADD CONSTRAINT "ApiEndpointUsage_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "StripeSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiRequest" ADD CONSTRAINT "ApiRequest_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeCustomer" ADD CONSTRAINT "StripeCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingUsage" ADD CONSTRAINT "BillingUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePrice" ADD CONSTRAINT "StripePrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "StripeProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeSubscription" ADD CONSTRAINT "StripeSubscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "StripeCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeSubscription" ADD CONSTRAINT "StripeSubscription_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "StripePrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeUsageRecord" ADD CONSTRAINT "StripeUsageRecord_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "StripeSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionFeature" ADD CONSTRAINT "SubscriptionFeature_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "StripeSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
