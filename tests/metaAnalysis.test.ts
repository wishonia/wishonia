/**
 * @jest-environment node
 */
import { ALZHEIMERS_FACTORS } from '@/constants/alzheimersFactors';
import { generateMetaAnalysis } from '@/lib/meta-analysis/metaAnalysis';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
describe('Meta Analysis Generator', () => {
  const condition = "Alzheimer's Disease";
  let treatments = ALZHEIMERS_FACTORS.MEDICATIONS.APPROVED;
  //treatments = ['Colchicine']
  beforeAll(async () => {
    // await prisma.article.deleteMany({
    //   where: {
    //     userId: 'test-user'
    //   }
    // });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should generate meta-analysis for dementia treatments', async () => {
    const result = await generateMetaAnalysis({
      condition,
      treatments,
      userId: "test-user",
      researchOptions: {
        //wordLimit: 2500,
        //includeSummary: true,
        //purpose: "Create a comprehensive meta-analysis focusing on effectiveness"
      }
    });

    expect(result.condition).toBe(condition);
    expect(result.treatmentAnalyses).toHaveLength(treatments.length);

    // Verify each treatment analysis
    result.treatmentAnalyses.forEach((analysis, index) => {
      expect(analysis.treatment).toBe(treatments[index]);
      expect(analysis.articleId).toBeDefined();
      expect(analysis.content).toBeTruthy();
      
      // Check for key sections relevant to dementia treatments
      const content = analysis.content.toLowerCase();
      expect(content).toMatch(/cognitive|memory|cognition/);
      expect(content).toMatch(/effectiveness|efficacy/);
      expect(content).toMatch(/side effects|adverse/);
      expect(content).toMatch(/clinical trials|studies/);
      expect(content).toMatch(/dosage|dose/);
      expect(content).toMatch(/safety/);
    });

    // Log results for manual inspection
    console.log('\nGenerated Analyses:');
    result.treatmentAnalyses.forEach(analysis => {
      console.log(`\n${analysis.treatment}:`);
      console.log(`Title: ${analysis.title}`);
      console.log(`Description: ${analysis.description.slice(0, 200)}...`);
    });
  }, 6000000); // 10-minute timeout

});