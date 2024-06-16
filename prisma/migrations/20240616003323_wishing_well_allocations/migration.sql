/*
  Warnings:

  - A unique constraint covering the columns `[userId,thisWishingWellId,thatWishingWellId]` on the table `WishingWellPairAllocation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WishingWellPairAllocation_userId_thisWishingWellId_thatWish_key" ON "WishingWellPairAllocation"("userId", "thisWishingWellId", "thatWishingWellId");
