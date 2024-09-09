/**
 * @jest-environment node
 */
import { createIssuesFromTranscript, saveIssuesToGitHub } from "@/lib/github/issueManager";
import { PrismaClient } from '@prisma/client';
import { Octokit } from '@octokit/rest';

const prisma = new PrismaClient();

// Mock Octokit
jest.mock('@octokit/rest');

describe("IssueManager tests", () => {
  jest.setTimeout(60000); // 60 seconds timeout

  const mockTranscript = `
    Alice: We need to fix the login bug on the homepage.
    Bob: Agreed. I'll take that on. We should also add a new feature for user profiles.
    Charlie: Good idea. I can work on the documentation for the new API.
    Alice: Great. Let's also schedule a performance review next week.
  `;

  const repoOwner = 'test-owner';
  const repoName = 'test-repo';
  const githubToken = 'test-token';

  it("Generates issues from transcript", async () => {
    const generatedIssues = await createIssuesFromTranscript(mockTranscript, repoOwner, repoName);
    
    expect(generatedIssues).not.toBeNull();
    expect(Array.isArray(generatedIssues)).toBe(true);
    expect(generatedIssues.length).toBeGreaterThan(0);
    
    generatedIssues.forEach(issue => {
      expect(issue).toHaveProperty('title');
      expect(issue).toHaveProperty('body');
      expect(issue).toHaveProperty('labels');
      expect(issue).toHaveProperty('assignees');
    });
  });

  it("Saves issues to GitHub", async () => {
    const mockIssues = [
      {
        title: 'Fix login bug',
        body: 'There is a login bug on the homepage that needs to be fixed.',
        labels: ['bug'],
        assignees: ['Bob']
      },
      {
        title: 'Add user profiles feature',
        body: 'Implement a new feature for user profiles.',
        labels: ['feature'],
        assignees: ['Bob']
      }
    ];

    // Mock the Octokit issues.create method
    const mockCreate = jest.fn().mockResolvedValue({ data: { html_url: 'https://github.com/test-owner/test-repo/issues/1' } });
    (Octokit as jest.MockedClass<typeof Octokit>).mockImplementation(() => ({
      issues: { create: mockCreate }
    }) as unknown as InstanceType<typeof Octokit>);

    await saveIssuesToGitHub(mockIssues, repoOwner, repoName, githubToken);

    expect(mockCreate).toHaveBeenCalledTimes(mockIssues.length);
    mockIssues.forEach((issue, index) => {
      expect(mockCreate).toHaveBeenNthCalledWith(index + 1, {
        owner: repoOwner,
        repo: repoName,
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
        assignees: issue.assignees
      });
    });
  });

  // Add this afterAll hook to close the Prisma connection
  afterAll(async () => {
    await prisma.$disconnect();
  });
});