/*
  Warnings:

  - You are about to drop the column `last_login` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_password_reset` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `logins_count` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `multifactor` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `wishing_well_contribution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "wishing_well_contribution" DROP CONSTRAINT "wishing_well_contribution_wishing_well_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "last_login",
DROP COLUMN "last_password_reset",
DROP COLUMN "logins_count",
DROP COLUMN "multifactor",
DROP COLUMN "phone_verified";

-- DropTable
DROP TABLE "wishing_well_contribution";

-- CreateTable
CREATE TABLE "activity_log" (
    "id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishing_wells" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishing_wells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishing_well_contributions" (
    "id" TEXT NOT NULL,
    "wishing_well_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "wishing_well_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genie_daos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reputation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "genie_daos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wish_fulfillment_proposals" (
    "id" TEXT NOT NULL,
    "wishing_well_id" TEXT NOT NULL,
    "genie_dao_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "leadIndicator" TEXT NOT NULL,
    "lagIndicator" TEXT NOT NULL,
    "wishTokens" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "wish_fulfillment_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_progress_reports" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "proposal_progress_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_comparisons" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "this_proposal_id" TEXT NOT NULL,
    "that_proposal_id" TEXT NOT NULL,
    "this_proposal_percentage" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposal_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishing_well_comparisons" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "this_wishing_well_id" TEXT NOT NULL,
    "that_wishing_well_id" TEXT NOT NULL,
    "this_wishing_well_percentage" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishing_well_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genie_dao_feedback" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "genie_dao_id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genie_dao_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JoinedGenieDAOs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProposalCollaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_JoinedGenieDAOs_AB_unique" ON "_JoinedGenieDAOs"("A", "B");

-- CreateIndex
CREATE INDEX "_JoinedGenieDAOs_B_index" ON "_JoinedGenieDAOs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProposalCollaborators_AB_unique" ON "_ProposalCollaborators"("A", "B");

-- CreateIndex
CREATE INDEX "_ProposalCollaborators_B_index" ON "_ProposalCollaborators"("B");

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishing_wells" ADD CONSTRAINT "wishing_wells_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishing_well_contributions" ADD CONSTRAINT "wishing_well_contributions_wishing_well_id_fkey" FOREIGN KEY ("wishing_well_id") REFERENCES "wishing_wells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genie_daos" ADD CONSTRAINT "genie_daos_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wish_fulfillment_proposals" ADD CONSTRAINT "wish_fulfillment_proposals_wishing_well_id_fkey" FOREIGN KEY ("wishing_well_id") REFERENCES "wishing_wells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wish_fulfillment_proposals" ADD CONSTRAINT "wish_fulfillment_proposals_genie_dao_id_fkey" FOREIGN KEY ("genie_dao_id") REFERENCES "genie_daos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wish_fulfillment_proposals" ADD CONSTRAINT "wish_fulfillment_proposals_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_progress_reports" ADD CONSTRAINT "proposal_progress_reports_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "wish_fulfillment_proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_progress_reports" ADD CONSTRAINT "proposal_progress_reports_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_comparisons" ADD CONSTRAINT "proposal_comparisons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishing_well_comparisons" ADD CONSTRAINT "wishing_well_comparisons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genie_dao_feedback" ADD CONSTRAINT "genie_dao_feedback_genie_dao_id_fkey" FOREIGN KEY ("genie_dao_id") REFERENCES "genie_daos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genie_dao_feedback" ADD CONSTRAINT "genie_dao_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JoinedGenieDAOs" ADD CONSTRAINT "_JoinedGenieDAOs_A_fkey" FOREIGN KEY ("A") REFERENCES "genie_daos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JoinedGenieDAOs" ADD CONSTRAINT "_JoinedGenieDAOs_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProposalCollaborators" ADD CONSTRAINT "_ProposalCollaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "genie_daos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProposalCollaborators" ADD CONSTRAINT "_ProposalCollaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "wish_fulfillment_proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
