import { PrismaClient } from "@prisma/client"
import { seedCureAccelerationAct } from "./seeders/globalSolutions/cure-acceleration-act"

const prisma = new PrismaClient()

async function main() {
  await seedCureAccelerationAct()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
