-- DropIndex because it's too long to index
DROP INDEX IF EXISTS "GlobalProblem_content_key";

-- DropIndex
DROP INDEX IF EXISTS "GlobalSolution_content_key";

-- DropIndex
DROP INDEX IF EXISTS "GlobalTask_content_key";
