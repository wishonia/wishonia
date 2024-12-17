/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[githubUsername]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[twitterHandle]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[web3Wallet]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[firstName,lastName,email]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber,lastName,firstName]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[twitterHandle,githubUsername]` on the table `Person` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Person_githubUsername_key" ON "Person"("githubUsername");

-- CreateIndex
CREATE UNIQUE INDEX "Person_phoneNumber_key" ON "Person"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Person_twitterHandle_key" ON "Person"("twitterHandle");

-- CreateIndex
CREATE UNIQUE INDEX "Person_web3Wallet_key" ON "Person"("web3Wallet");

-- CreateIndex
CREATE INDEX "Person_name_idx" ON "Person"("name");

-- CreateIndex
CREATE INDEX "Person_email_idx" ON "Person"("email");

-- CreateIndex
CREATE INDEX "Person_phoneNumber_idx" ON "Person"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Person_firstName_lastName_email_key" ON "Person"("firstName", "lastName", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Person_phoneNumber_lastName_firstName_key" ON "Person"("phoneNumber", "lastName", "firstName");

-- CreateIndex
CREATE UNIQUE INDEX "Person_twitterHandle_githubUsername_key" ON "Person"("twitterHandle", "githubUsername");
