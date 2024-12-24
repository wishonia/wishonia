import { PrismaClient, Severity } from '@prisma/client'
import type { DfdaTreatmentSideEffect, DfdaUserSideEffectReport } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

// Export the types we'll need in tests
export type SideEffectAggregate = Pick<DfdaTreatmentSideEffect,
  'treatmentId' | 'sideEffectId' | 'votesPercent'
>

export type SideEffectReport = Pick<DfdaUserSideEffectReport,
  'userId' | 'treatmentId' | 'sideEffectId' | 'severity'
>

// Export the functions needed for testing
export { generateSideEffectReports, verifySideEffectReports }

function generateFakeUser(index: number) {
  return {
    id: `dfda_user_${index}`,
    email: `dfda_user_${index}@example.com`,
    name: `DFDA User ${index}`,
  }
}

async function calculateMinimumUsers(): Promise<number> {
  // Get count of side effects per treatment
  const treatmentCounts = await prisma.dfdaTreatmentSideEffect.groupBy({
    by: ['treatmentId'],
    _count: {
      sideEffectId: true
    },
    where: { deletedAt: null }
  })

  // Find the treatment with the most side effects
  const maxSideEffectsPerTreatment = Math.max(
    ...treatmentCounts.map(t => t._count.sideEffectId)
  )

  // Each treatment-side-effect pair needs 100 unique users
  // A user can report on different treatments, but not on multiple side effects for the same treatment
  const minimumUsers = maxSideEffectsPerTreatment * 100

  return minimumUsers
}

export async function generateAndSaveSideEffectReports(): Promise<void> {
  console.log('Loading side effect aggregates from database...')
  
  const aggregates = await prisma.dfdaTreatmentSideEffect.findMany({
    where: { deletedAt: null },
    select: {
      treatmentId: true,
      sideEffectId: true,
      votesPercent: true,
    }
  })

  console.log(`Found ${aggregates.length} treatment-side-effect pairs`)
  
  // Calculate minimum users needed
  const minimumUsers = await calculateMinimumUsers()
  const userCount = Math.ceil(minimumUsers * 1.2) // Add 20% buffer
  
  console.log(`Minimum users needed: ${minimumUsers}`)
  console.log(`Generating ${userCount} users (including 20% buffer)`)
  
  const users = Array.from({ length: userCount }, (_, i) => generateFakeUser(i))
  
  console.log(`Generating reports using ${users.length} synthetic users...`)
  
  // Generate reports for each aggregate
  let allReports: SideEffectReport[] = []
  
  for (const aggregate of aggregates) {
    const reports = generateSideEffectReports(
      users.map(u => u.id),
      aggregate,
      100
    )
    
    // Verify the reports match the aggregate
    verifySideEffectReports(reports, aggregate)
    
    allReports = [...allReports, ...reports]
  }

  // Save reports to file
  const outputDir = path.join(process.cwd(), 'prisma', 'seeds')
  await fs.mkdir(outputDir, { recursive: true })
  
  const outputPath = path.join(outputDir, 'DfdaUserSideEffectReport.json')
  await fs.writeFile(outputPath, JSON.stringify(allReports, null, 2))

  // Log summary
  console.log('\nGeneration Summary:')
  console.log(`Generated ${allReports.length} side effect reports`)
  console.log(`Using ${users.length} synthetic users`)
  console.log(`Saved to ${outputPath}`)

  // Save users too for reference
  const usersPath = path.join(outputDir, 'User.json')
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2))
  console.log(`Saved users to ${usersPath}`)
}

function generateSideEffectReports(
  userIds: string[],
  aggregate: SideEffectAggregate,
  totalReports: number
): SideEffectReport[] {
  // Calculate how many reports should have the side effect
  const reportsWithSideEffect = Math.round((aggregate.votesPercent / 100) * totalReports)
  const reportsWithoutSideEffect = totalReports - reportsWithSideEffect

  // Verify we have enough users
  if (userIds.length < totalReports) {
    throw new Error(
      `Not enough users (${userIds.length}) to generate ${totalReports} reports ` +
      `for treatment ${aggregate.treatmentId}, side effect ${aggregate.sideEffectId}`
    )
  }

  // Create severity distribution for positive reports
  const severityOptions: Severity[] = ['MINIMAL', 'MILD', 'MODERATE', 'SEVERE', 'EXTREME']
  const severityWeights = [0.2, 0.3, 0.3, 0.15, 0.05] // Reasonable distribution

  const severityList: Severity[] = []
  for (let i = 0; i < reportsWithSideEffect; i++) {
    // Select severity based on weights
    const rand = Math.random()
    let cumulativeWeight = 0
    let selectedSeverity = severityOptions[0]
    
    for (let j = 0; j < severityOptions.length; j++) {
      cumulativeWeight += severityWeights[j]
      if (rand <= cumulativeWeight) {
        selectedSeverity = severityOptions[j]
        break
      }
    }
    severityList.push(selectedSeverity)
  }

  // Add reports without side effect
  const fullSeverityList = [
    ...severityList,
    ...Array(reportsWithoutSideEffect).fill('NONE' as Severity)
  ]

  // Shuffle users and severity values
  const shuffledUsers = [...userIds].sort(() => Math.random() - 0.5)
  const shuffledSeverity = [...fullSeverityList].sort(() => Math.random() - 0.5)

  // Generate reports
  return shuffledUsers
    .slice(0, totalReports)
    .map((userId, index) => ({
      userId,
      treatmentId: aggregate.treatmentId,
      sideEffectId: aggregate.sideEffectId,
      severity: shuffledSeverity[index],
    }))
}

function verifySideEffectReports(
  reports: SideEffectReport[],
  aggregate: SideEffectAggregate
): void {
  // Count reports with and without side effect
  const totalReports = reports.length
  const reportsWithSideEffect = reports.filter(r => r.severity !== 'NONE').length
  
  // Calculate percentage
  const calculatedPercent = Math.round((reportsWithSideEffect / totalReports) * 100)

  // Allow for 1% difference due to rounding
  if (Math.abs(calculatedPercent - aggregate.votesPercent) > 1) {
    throw new Error(
      'Side effect percentage mismatch:\n' +
      `Expected: ${aggregate.votesPercent}%\n` +
      `Got: ${calculatedPercent}%\n` +
      `For treatment ${aggregate.treatmentId}, side effect ${aggregate.sideEffectId}\n` +
      `(${reportsWithSideEffect} out of ${totalReports} reports)`
    )
  }
}

// Run generator if called directly
if (require.main === module) {
  generateAndSaveSideEffectReports()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
} 