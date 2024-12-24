import { PrismaClient, Severity } from '@prisma/client'
import type { DfdaConditionSymptom, DfdaUserSymptomReport } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

type SymptomAggregate = Pick<DfdaConditionSymptom,
  'conditionId' | 'symptomId' | 'votes' | 
  'extreme' | 'severe' | 'moderate' | 'mild' | 'minimal'
>

type SymptomReport = Pick<DfdaUserSymptomReport,
  'userId' | 'symptomId' | 'conditionId' | 'severity'
>

function generateFakeUser(index: number) {
  return {
    id: `dfda_user_${index}`,
    email: `dfda_user_${index}@example.com`,
    name: `DFDA User ${index}`,
  }
}

export async function generateAndSaveSymptomReports(): Promise<void> {
  console.log('Loading symptom aggregates from database...')
  
  // Fetch aggregates from database
  const aggregates = await prisma.dfdaConditionSymptom.findMany({
    where: { deletedAt: null },
    select: {
      conditionId: true,
      symptomId: true,
      votes: true,
      extreme: true,
      severe: true,
      moderate: true,
      mild: true,
      minimal: true,
    }
  })

  console.log(`Found ${aggregates.length} condition-symptom pairs`)
  
  // Calculate total number of users needed
  const maxUsersNeeded = aggregates.reduce((max, agg) => 
    Math.max(max, agg.votes || 0), 0)
  
  // Generate enough users (add 20% buffer)
  const userCount = Math.ceil(maxUsersNeeded * 1.2)
  const users = Array.from({ length: userCount }, (_, i) => generateFakeUser(i))
  
  console.log(`Generating reports using ${users.length} synthetic users...`)
  
  // Generate reports for each aggregate
  let allReports: SymptomReport[] = []
  
  for (const aggregate of aggregates) {
    const reports = generateSymptomReports(
      users.map(u => u.id),
      aggregate
    )
    
    // Verify the reports match the aggregate
    verifySymptomReports(reports, aggregate)
    
    allReports = [...allReports, ...reports]
  }

  // Save reports to file
  const outputDir = path.join(process.cwd(), 'prisma', 'seeds')
  await fs.mkdir(outputDir, { recursive: true })
  
  const outputPath = path.join(outputDir, 'DfdaUserSymptomReport.json')
  await fs.writeFile(outputPath, JSON.stringify(allReports, null, 2))

  // Log summary
  console.log('\nGeneration Summary:')
  console.log(`Generated ${allReports.length} symptom reports`)
  console.log(`Using ${users.length} synthetic users`)
  console.log(`Saved to ${outputPath}`)

  // Save users too for reference
  const usersPath = path.join(outputDir, 'User.json')
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2))
  console.log(`Saved users to ${usersPath}`)
}

function generateSymptomReports(
  userIds: string[],
  aggregate: SymptomAggregate
): SymptomReport[] {
  // Calculate total needed reports from severity counts
  const severityCounts = {
    EXTREME: aggregate.extreme || 0,
    SEVERE: aggregate.severe || 0,
    MODERATE: aggregate.moderate || 0,
    MILD: aggregate.mild || 0,
    MINIMAL: aggregate.minimal || 0,
  }

  const totalReports = Object.values(severityCounts).reduce((sum, count) => sum + count, 0)

//   // Verify total matches votes
//   if (totalReports !== aggregate.votes) {
//     console.error(
//       `Sum of severity counts (${totalReports}) doesn't match ` +
//       `votes (${aggregate.votes}) for condition ${aggregate.conditionId}, ` +
//       `symptom ${aggregate.symptomId}`
//     )
//   }

  // Verify we have enough users
  if (userIds.length < totalReports) {
    throw new Error(
      `Not enough users (${userIds.length}) to generate ${totalReports} reports ` +
      `for condition ${aggregate.conditionId}, symptom ${aggregate.symptomId}`
    )
  }

  // Create array of severity values based on counts
  const severityList: Severity[] = Object.entries(severityCounts).flatMap(
    ([severity, count]) => Array(count).fill(severity as Severity)
  )

  // Shuffle users and severity values
  const shuffledUsers = [...userIds].sort(() => Math.random() - 0.5)
  const shuffledSeverity = [...severityList].sort(() => Math.random() - 0.5)

  // Generate reports
  return shuffledUsers
    .slice(0, totalReports)
    .map((userId, index) => ({
      userId,
      symptomId: aggregate.symptomId,
      conditionId: aggregate.conditionId,
      severity: shuffledSeverity[index],
    }))
}

function verifySymptomReports(
  reports: SymptomReport[],
  aggregate: SymptomAggregate
): void {
  // Count severity distribution
  const counts = {
    extreme: 0,
    severe: 0,
    moderate: 0,
    mild: 0,
    minimal: 0,
  }

  reports.forEach(report => {
    switch (report.severity) {
      case 'EXTREME': counts.extreme++; break
      case 'SEVERE': counts.severe++; break
      case 'MODERATE': counts.moderate++; break
      case 'MILD': counts.mild++; break
      case 'MINIMAL': counts.minimal++; break
    }
  })

  // Verify total matches votes
//   const totalReports = reports.length
//   if (totalReports !== aggregate.votes) {
//     console.error(
//       `Generated report count (${totalReports}) doesn't match ` +
//       `votes (${aggregate.votes}) for condition ${aggregate.conditionId}, ` +
//       `symptom ${aggregate.symptomId}`
//     )
//   }

  // Verify severity distribution matches
  if (counts.extreme !== (aggregate.extreme || 0) ||
      counts.severe !== (aggregate.severe || 0) ||
      counts.moderate !== (aggregate.moderate || 0) ||
      counts.mild !== (aggregate.mild || 0) ||
      counts.minimal !== (aggregate.minimal || 0)) {
    throw new Error(
      'Severity distribution mismatch:\n' +
      `Expected: ${JSON.stringify(aggregate, null, 2)}\n` +
      `Got: ${JSON.stringify(counts, null, 2)}`
    )
  }
}

// Run generator if called directly
if (require.main === module) {
  generateAndSaveSymptomReports()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
} 