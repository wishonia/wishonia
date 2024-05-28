/*
  Warnings:

  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `activity_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `educations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `endorsements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `friendships` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `genie_dao_feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `genie_daos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `global_problem_pair_allocations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `global_problems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `positions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proposal_comparisons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proposal_progress_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recommendations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wish_fulfillment_proposals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wishing_well_contributions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wishing_well_pair_allocations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wishing_wells` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_JoinedGenieDAOs" DROP CONSTRAINT "_JoinedGenieDAOs_A_fkey";

-- DropForeignKey
ALTER TABLE "_JoinedGenieDAOs" DROP CONSTRAINT "_JoinedGenieDAOs_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProposalCollaborators" DROP CONSTRAINT "_ProposalCollaborators_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProposalCollaborators" DROP CONSTRAINT "_ProposalCollaborators_B_fkey";

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_user_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_log" DROP CONSTRAINT "activity_log_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "educations" DROP CONSTRAINT "educations_userId_fkey";

-- DropForeignKey
ALTER TABLE "endorsements" DROP CONSTRAINT "endorsements_skillId_fkey";

-- DropForeignKey
ALTER TABLE "endorsements" DROP CONSTRAINT "endorsements_userId_fkey";

-- DropForeignKey
ALTER TABLE "friendships" DROP CONSTRAINT "friendships_friendId_fkey";

-- DropForeignKey
ALTER TABLE "friendships" DROP CONSTRAINT "friendships_userId_fkey";

-- DropForeignKey
ALTER TABLE "genie_dao_feedback" DROP CONSTRAINT "genie_dao_feedback_genie_dao_id_fkey";

-- DropForeignKey
ALTER TABLE "genie_dao_feedback" DROP CONSTRAINT "genie_dao_feedback_user_id_fkey";

-- DropForeignKey
ALTER TABLE "genie_daos" DROP CONSTRAINT "genie_daos_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "global_problem_pair_allocations" DROP CONSTRAINT "global_problem_pair_allocations_that_global_problem_id_fkey";

-- DropForeignKey
ALTER TABLE "global_problem_pair_allocations" DROP CONSTRAINT "global_problem_pair_allocations_this_global_problem_id_fkey";

-- DropForeignKey
ALTER TABLE "global_problem_pair_allocations" DROP CONSTRAINT "global_problem_pair_allocations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "global_problems" DROP CONSTRAINT "global_problems_user_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_postId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "positions" DROP CONSTRAINT "positions_userId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_fkey";

-- DropForeignKey
ALTER TABLE "proposal_comparisons" DROP CONSTRAINT "proposal_comparisons_user_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal_progress_reports" DROP CONSTRAINT "proposal_progress_reports_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "proposal_progress_reports" DROP CONSTRAINT "proposal_progress_reports_proposal_id_fkey";

-- DropForeignKey
ALTER TABLE "recommendations" DROP CONSTRAINT "recommendations_recommenderId_fkey";

-- DropForeignKey
ALTER TABLE "recommendations" DROP CONSTRAINT "recommendations_userId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_userId_fkey";

-- DropForeignKey
ALTER TABLE "wish_fulfillment_proposals" DROP CONSTRAINT "wish_fulfillment_proposals_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "wish_fulfillment_proposals" DROP CONSTRAINT "wish_fulfillment_proposals_genie_dao_id_fkey";

-- DropForeignKey
ALTER TABLE "wish_fulfillment_proposals" DROP CONSTRAINT "wish_fulfillment_proposals_wishing_well_id_fkey";

-- DropForeignKey
ALTER TABLE "wishing_well_contributions" DROP CONSTRAINT "wishing_well_contributions_wishing_well_id_fkey";

-- DropForeignKey
ALTER TABLE "wishing_well_pair_allocations" DROP CONSTRAINT "wishing_well_pair_allocations_that_wishing_well_id_fkey";

-- DropForeignKey
ALTER TABLE "wishing_well_pair_allocations" DROP CONSTRAINT "wishing_well_pair_allocations_this_wishing_well_id_fkey";

-- DropForeignKey
ALTER TABLE "wishing_well_pair_allocations" DROP CONSTRAINT "wishing_well_pair_allocations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "wishing_wells" DROP CONSTRAINT "wishing_wells_user_id_fkey";

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "activities";

-- DropTable
DROP TABLE "activity_log";

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "educations";

-- DropTable
DROP TABLE "endorsements";

-- DropTable
DROP TABLE "friendships";

-- DropTable
DROP TABLE "genie_dao_feedback";

-- DropTable
DROP TABLE "genie_daos";

-- DropTable
DROP TABLE "global_problem_pair_allocations";

-- DropTable
DROP TABLE "global_problems";

-- DropTable
DROP TABLE "likes";

-- DropTable
DROP TABLE "positions";

-- DropTable
DROP TABLE "posts";

-- DropTable
DROP TABLE "proposal_comparisons";

-- DropTable
DROP TABLE "proposal_progress_reports";

-- DropTable
DROP TABLE "recommendations";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "skills";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "verification_tokens";

-- DropTable
DROP TABLE "wish_fulfillment_proposals";

-- DropTable
DROP TABLE "wishing_well_contributions";

-- DropTable
DROP TABLE "wishing_well_pair_allocations";

-- DropTable
DROP TABLE "wishing_wells";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerType" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "accessTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "badges" JSONB,
    "banned" BOOLEAN,
    "bio" TEXT,
    "birthday" TIMESTAMP(3),
    "blog" TEXT,
    "city" TEXT,
    "company" TEXT,
    "contributorsEnabled" BOOLEAN,
    "countryCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAtTwitter" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "favouritesCount" INTEGER,
    "firstName" TEXT,
    "followersCount" INTEGER,
    "followingCount" INTEGER,
    "gdprConsent" BOOLEAN NOT NULL DEFAULT false,
    "gender" TEXT,
    "geoEnabled" BOOLEAN,
    "githubUsername" TEXT,
    "hireable" BOOLEAN,
    "image" TEXT,
    "ipAddress" VARCHAR(45),
    "language" TEXT,
    "lastName" TEXT,
    "lastSignInAt" BIGINT,
    "likeCount" INTEGER,
    "listedCount" INTEGER,
    "location" TEXT,
    "name" TEXT,
    "newsletterSubscribed" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" TEXT,
    "points" INTEGER,
    "postalCode" TEXT,
    "privateMetadata" JSONB,
    "profileBannerUrl" TEXT,
    "protected" BOOLEAN,
    "publicMetadata" JSONB,
    "referrerUserId" TEXT,
    "signatureTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signedPetition" BOOLEAN NOT NULL DEFAULT false,
    "stateProvince" TEXT,
    "statusesCount" INTEGER,
    "timeZone" TEXT,
    "tweetCount" INTEGER,
    "twitterHandle" TEXT,
    "type" TEXT,
    "unsafeMetadata" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "verified" BOOLEAN,
    "warPercentageDesired" DOUBLE PRECISION,
    "warPercentageGuessed" DOUBLE PRECISION,
    "web3Wallet" TEXT,
    "website" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "degree" TEXT,
    "fieldOfStudy" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endorsement" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Endorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recommenderId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "colorCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalProblem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "averageAllocation" DOUBLE PRECISION,

    CONSTRAINT "GlobalProblem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalProblemPairAllocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thisGlobalProblemId" TEXT NOT NULL,
    "thatGlobalProblemId" TEXT NOT NULL,
    "thisGlobalProblemPercentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalProblemPairAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishingWell" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "images" TEXT[],
    "featuredImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "averageAllocation" DOUBLE PRECISION,

    CONSTRAINT "WishingWell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishingWellPairAllocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thisWishingWellId" TEXT NOT NULL,
    "thatWishingWellId" TEXT NOT NULL,
    "thisWishingWellPercentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WishingWellPairAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishingWellContribution" (
    "id" TEXT NOT NULL,
    "wishingWellId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "WishingWellContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenieDAO" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reputation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "GenieDAO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishFulfillmentProposal" (
    "id" TEXT NOT NULL,
    "wishingWellId" TEXT NOT NULL,
    "genieDAOId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "leadIndicator" TEXT NOT NULL,
    "lagIndicator" TEXT NOT NULL,
    "wishTokens" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "WishFulfillmentProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalProgressReport" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "ProposalProgressReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalComparison" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thisProposalId" TEXT NOT NULL,
    "thatProposalId" TEXT NOT NULL,
    "thisProposalPercentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProposalComparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenieDAOFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "genieDAOId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenieDAOFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerId_providerAccountId_key" ON "Account"("providerId", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Session_accessToken_key" ON "Session"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_token_key" ON "VerificationRequest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_identifier_token_key" ON "VerificationRequest"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalProblem_name_key" ON "GlobalProblem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WishingWell_name_key" ON "WishingWell"("name");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorsement" ADD CONSTRAINT "Endorsement_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorsement" ADD CONSTRAINT "Endorsement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_recommenderId_fkey" FOREIGN KEY ("recommenderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalProblem" ADD CONSTRAINT "GlobalProblem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalProblemPairAllocation" ADD CONSTRAINT "GlobalProblemPairAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalProblemPairAllocation" ADD CONSTRAINT "GlobalProblemPairAllocation_thisGlobalProblemId_fkey" FOREIGN KEY ("thisGlobalProblemId") REFERENCES "GlobalProblem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalProblemPairAllocation" ADD CONSTRAINT "GlobalProblemPairAllocation_thatGlobalProblemId_fkey" FOREIGN KEY ("thatGlobalProblemId") REFERENCES "GlobalProblem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishingWell" ADD CONSTRAINT "WishingWell_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishingWellPairAllocation" ADD CONSTRAINT "WishingWellPairAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishingWellPairAllocation" ADD CONSTRAINT "WishingWellPairAllocation_thisWishingWellId_fkey" FOREIGN KEY ("thisWishingWellId") REFERENCES "WishingWell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishingWellPairAllocation" ADD CONSTRAINT "WishingWellPairAllocation_thatWishingWellId_fkey" FOREIGN KEY ("thatWishingWellId") REFERENCES "WishingWell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishingWellContribution" ADD CONSTRAINT "WishingWellContribution_wishingWellId_fkey" FOREIGN KEY ("wishingWellId") REFERENCES "WishingWell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenieDAO" ADD CONSTRAINT "GenieDAO_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishFulfillmentProposal" ADD CONSTRAINT "WishFulfillmentProposal_wishingWellId_fkey" FOREIGN KEY ("wishingWellId") REFERENCES "WishingWell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishFulfillmentProposal" ADD CONSTRAINT "WishFulfillmentProposal_genieDAOId_fkey" FOREIGN KEY ("genieDAOId") REFERENCES "GenieDAO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishFulfillmentProposal" ADD CONSTRAINT "WishFulfillmentProposal_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalProgressReport" ADD CONSTRAINT "ProposalProgressReport_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "WishFulfillmentProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalProgressReport" ADD CONSTRAINT "ProposalProgressReport_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalComparison" ADD CONSTRAINT "ProposalComparison_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenieDAOFeedback" ADD CONSTRAINT "GenieDAOFeedback_genieDAOId_fkey" FOREIGN KEY ("genieDAOId") REFERENCES "GenieDAO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenieDAOFeedback" ADD CONSTRAINT "GenieDAOFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JoinedGenieDAOs" ADD CONSTRAINT "_JoinedGenieDAOs_A_fkey" FOREIGN KEY ("A") REFERENCES "GenieDAO"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JoinedGenieDAOs" ADD CONSTRAINT "_JoinedGenieDAOs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProposalCollaborators" ADD CONSTRAINT "_ProposalCollaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "GenieDAO"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProposalCollaborators" ADD CONSTRAINT "_ProposalCollaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "WishFulfillmentProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
