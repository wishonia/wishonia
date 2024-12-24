import { Effectiveness, PrismaClient } from '@prisma/client'
import type { DfdaConditionTreatment, DfdaUserTreatmentReport } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

type TreatmentAggregate = Pick<DfdaConditionTreatment,
  'conditionId' | 'treatmentId' | 'popularity' | 
  'majorImprovement' | 'moderateImprovement' | 'noEffect' | 'worse' | 'muchWorse'
>

type TreatmentReport = Pick<DfdaUserTreatmentReport,
  'userId' | 'treatmentId' | 'conditionId' | 'effectiveness' | 'tried'
>

const EFFECT_SCORES: Record<Effectiveness, number> = {
  'MUCH_WORSE': -2,
  'WORSE': -1,
  'NO_EFFECT': 0,
  'MODERATE_IMPROVEMENT': 1,
  'MAJOR_IMPROVEMENT': 2,
}

function generateFakeUser(index: number) {
  return {
    id: `dfda_user_${index}`,
    email: `dfda_user_${index}@example.com`,
    name: `DFDA User ${index}`,
  }
}

export async function generateAndSaveTreatmentReports(): Promise<void> {
  console.log('Loading treatment aggregates from database...')
  
  // Fetch aggregates from database
  const aggregates = await prisma.dfdaConditionTreatment.findMany({
    where: { deletedAt: null },
    select: {
      conditionId: true,
      treatmentId: true,
      popularity: true,
      majorImprovement: true,
      moderateImprovement: true,
      noEffect: true,
      worse: true,
      muchWorse: true,
    }
  })

  console.log(`Found ${aggregates.length} treatment-condition pairs`)
  
  // Calculate total number of users needed
  const maxUsersNeeded = aggregates.reduce((max, agg) => 
    Math.max(max, agg.popularity), 0)
  
  // Generate enough users (add 20% buffer)
  const userCount = Math.ceil(maxUsersNeeded * 1.2)
  const users = Array.from({ length: userCount }, (_, i) => generateFakeUser(i))
  
  console.log(`Generating reports using ${users.length} synthetic users...`)
  
  // Generate reports for each aggregate
  let allReports: TreatmentReport[] = []
  
  for (const aggregate of aggregates) {
    const reports = generateTreatmentReports(
      users.map(u => u.id),
      aggregate
    )
    
    // Verify the reports match the aggregate
    verifyTreatmentReports(reports, aggregate)
    
    allReports = [...allReports, ...reports]
  }

  // Save reports to file
  const outputDir = path.join(process.cwd(), 'prisma', 'seeds')
  await fs.mkdir(outputDir, { recursive: true })
  
  const outputPath = path.join(outputDir, 'DfdaUserTreatmentReport.json')
  await fs.writeFile(outputPath, JSON.stringify(allReports, null, 2))

  // Log summary
  console.log('\nGeneration Summary:')
  console.log(`Generated ${allReports.length} treatment reports`)
  console.log(`Using ${users.length} synthetic users`)
  console.log(`Saved to ${outputPath}`)

  // Save users too for reference
  const usersPath = path.join(outputDir, 'User.json')
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2))
  console.log(`Saved users to ${usersPath}`)
}

export function generateTreatmentReports(
  userIds: string[],
  aggregate: TreatmentAggregate
): TreatmentReport[] {
  // Verify we have enough users
  if (userIds.length < aggregate.popularity) {
    throw new Error(
      `Not enough users (${userIds.length}) to generate ${aggregate.popularity} reports ` +
      `for treatment ${aggregate.treatmentId}, condition ${aggregate.conditionId}`
    )
  }

  // Create array of effectiveness values based on aggregate counts
  const effectivenessList: Effectiveness[] = [
    ...Array(aggregate.majorImprovement).fill('MAJOR_IMPROVEMENT'),
    ...Array(aggregate.moderateImprovement).fill('MODERATE_IMPROVEMENT'),
    ...Array(aggregate.noEffect).fill('NO_EFFECT'),
    ...Array(aggregate.worse).fill('WORSE'),
    ...Array(aggregate.muchWorse).fill('MUCH_WORSE'),
  ]

  // Verify total matches popularity
  if (effectivenessList.length !== aggregate.popularity) {
    throw new Error(
      `Sum of effectiveness counts (${effectivenessList.length}) doesn't match ` +
      `popularity (${aggregate.popularity}) for treatment ${aggregate.treatmentId}, ` +
      `condition ${aggregate.conditionId}`
    )
  }

  // Shuffle users and effectiveness values
  const shuffledUsers = [...userIds].sort(() => Math.random() - 0.5)
  const shuffledEffectiveness = [...effectivenessList].sort(() => Math.random() - 0.5)

  // Generate reports
  const reports: TreatmentReport[] = shuffledUsers
    .slice(0, aggregate.popularity)
    .map((userId, index) => ({
      userId,
      treatmentId: aggregate.treatmentId,
      conditionId: aggregate.conditionId,
      effectiveness: shuffledEffectiveness[index],
      tried: true,
    }))

  // Verify average effect
  const calculatedAverage = calculateAverageEffect(reports)
  const expectedAverage = calculateAverageEffect(effectivenessList)
  
  if (Math.abs(calculatedAverage - expectedAverage) > 0.0001) { // Allow for floating point imprecision
    throw new Error(
      `Generated reports average effect (${calculatedAverage}) doesn't match ` +
      `expected average (${expectedAverage}) for treatment ${aggregate.treatmentId}, ` +
      `condition ${aggregate.conditionId}`
    )
  }

  return reports
}

function calculateAverageEffect(
  input: TreatmentReport[] | Effectiveness[]
): number {
  // Check if first item is a TreatmentReport by checking for effectiveness property
  const effects = Array.isArray(input) && input.length > 0 && 
    typeof input[0] === 'object' && input[0] !== null && 'effectiveness' in input[0]
    ? (input as TreatmentReport[]).map(r => r.effectiveness!)
    : input as Effectiveness[]

  const sum = effects.reduce((acc, effect) => acc + EFFECT_SCORES[effect], 0)
  return effects.length > 0 ? sum / effects.length : 0
}

// Helper to verify generated data matches aggregate
export function verifyTreatmentReports(
  reports: TreatmentReport[],
  aggregate: TreatmentAggregate
): void {
  // Check total count
  if (reports.length !== aggregate.popularity) {
    throw new Error(`Expected ${aggregate.popularity} reports, got ${reports.length}`)
  }

  // Count effectiveness distribution
  const counts = {
    majorImprovement: 0,
    moderateImprovement: 0,
    noEffect: 0,
    worse: 0,
    muchWorse: 0,
  }

  reports.forEach(report => {
    switch (report.effectiveness) {
      case 'MAJOR_IMPROVEMENT': counts.majorImprovement++; break
      case 'MODERATE_IMPROVEMENT': counts.moderateImprovement++; break
      case 'NO_EFFECT': counts.noEffect++; break
      case 'WORSE': counts.worse++; break
      case 'MUCH_WORSE': counts.muchWorse++; break
    }
  })

  // Verify counts match
  if (counts.majorImprovement !== aggregate.majorImprovement ||
      counts.moderateImprovement !== aggregate.moderateImprovement ||
      counts.noEffect !== aggregate.noEffect ||
      counts.worse !== aggregate.worse ||
      counts.muchWorse !== aggregate.muchWorse) {
    throw new Error(
      'Effectiveness distribution mismatch:\n' +
      `Expected: ${JSON.stringify(aggregate, null, 2)}\n` +
      `Got: ${JSON.stringify(counts, null, 2)}`
    )
  }
}
