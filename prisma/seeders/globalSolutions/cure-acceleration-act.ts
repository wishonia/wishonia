import fs from "fs"
import path from "path"
import { createGlobalSolution } from "@/lib/globalSolutions"
import { getOrCreateTestUser } from "@/tests/test-helpers"

export async function seedCureAccelerationAct() {
  const systemUser = await getOrCreateTestUser()

  // Read markdown content
  const markdownPath = path.join(process.cwd(), "public/globalSolutions/dfda", "cure-acceleration-act.md")
  const content = fs.readFileSync(markdownPath, "utf-8")

  await createGlobalSolution(
    "CURE ACCELERATION ACT",
    "cure-acceleration-act",
    content,
    undefined,
    systemUser.id
  )

  console.log("✅ Seeded Cure Acceleration Act global solution")
} 