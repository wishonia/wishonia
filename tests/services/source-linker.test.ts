/**
 * @jest-environment node
 */
import { SourceLinker, ContentFormat } from '@/lib/services/source-linker';
import { TavilyClient } from '@/lib/clients/tavily';
import { ContentAnalysis } from '@/lib/services/content-enhancer';
import { config } from 'dotenv';

config();

// Increase the default timeout for all tests in this file
jest.setTimeout(60000);

describe('SourceLinker', () => {
  let sourceLinker: SourceLinker;
  
  beforeAll(() => {
    const tavilyClient = new TavilyClient(process.env.TAVILY_API_KEY!);
    sourceLinker = new SourceLinker(tavilyClient);
  });

  it('should add source links to specific phrases in HTML content', async () => {
    const content = `The FDA approved the first AI-based diagnostic system in 2018, which represented a 45% increase in accuracy.`;
    const claims: ContentAnalysis['claimsToLink'] = [{
      claim: 'FDA approved the first AI-based diagnostic system in 2018',
      textToLink: 'FDA',
      context: content,
      location: {
        beforeText: 'The ',
        afterText: ' approved the first AI-based',
        headingContext: 'Introduction'
      },
      reason: 'Historical regulatory claim that needs verification',
      searchQuery: 'FDA first AI diagnostic system approval 2018',
      confidence: 0.9
    }, {
      claim: '45% increase in accuracy',
      textToLink: '45%',
      context: content,
      location: {
        beforeText: 'represented a ',
        afterText: ' increase in accuracy',
        headingContext: 'Results'
      },
      reason: 'Statistical claim that needs verification',
      searchQuery: 'AI diagnostic system accuracy improvement 45 percent',
      confidence: 0.9
    }];

    const result = await sourceLinker.addSourceLinks(content, claims, ContentFormat.HTML);
    
    // Check that only key phrases are linked
    expect(result.content).toContain('<a href="');
    expect(result.content).toContain('FDA');
    expect(result.content).toContain('45%');
    expect(result.sources[0].linkText).toBeDefined();
    expect(result.sources[0].linkText.length).toBeLessThan(claims[0].claim.length);

    // Check source tracking
    expect(result.sources.length).toBe(2);
    expect(result.sources[0]).toMatchObject({
      url: expect.stringContaining('http'),
      title: expect.any(String),
      relevantQuote: claims[0].claim,
      confidence: expect.any(Number),
      linkText: expect.any(String)
    });
  });

  it('should add source links to specific phrases in Markdown content', async () => {
    const content = `Research shows that AI models achieve 92% accuracy in medical diagnosis.`;
    const claims: ContentAnalysis['claimsToLink'] = [{
      claim: 'AI models achieve 92% accuracy in medical diagnosis',
      textToLink: '92%',
      context: content,
      location: {
        beforeText: 'AI models achieve ',
        afterText: ' accuracy in medical diagnosis',
        headingContext: 'Results'
      },
      reason: 'Statistical claim that needs verification',
      searchQuery: 'AI medical diagnosis accuracy 92 percent research',
      confidence: 0.9
    }];

    const result = await sourceLinker.addSourceLinks(content, claims, ContentFormat.MARKDOWN);
    
    // Check that only the percentage is linked
    expect(result.content).toContain('[92%]');
    expect(result.sources[0].linkText).toBe('92%');
    expect(result.sources[0].linkText.length).toBeLessThan(claims[0].claim.length);
  });
}); 