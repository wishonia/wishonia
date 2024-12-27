import { anthropic } from "@ai-sdk/anthropic";
import { LanguageModelV1 } from "@ai-sdk/provider";
import { Octokit } from '@octokit/rest';
import { generateObject } from 'ai';
import { z } from 'zod';

const GeneratedIssueSchema = z.object({
  title: z.string().describe('The title of the GitHub issue'),
  body: z.string().describe('The body content of the GitHub issue'),
  labels: z.array(z.string()).describe('Labels for the issue'),
  assignees: z.array(z.string()).describe('GitHub usernames of assignees'),
});

const GeneratedIssuesWrapperSchema = z.object({
  issues: z.array(GeneratedIssueSchema).describe('An array of generated GitHub issues'),
});

type GeneratedIssue = z.infer<typeof GeneratedIssueSchema>;

export async function createIssuesFromTranscript(
  transcript: string,
  repoOwner: string,
  repoName: string,
  options: {
    modelName?: 'claude-3-sonnet-20240229' | 'claude-3-opus-20240229',
    maxIssues?: number,
  } = {}
): Promise<GeneratedIssue[]> {
  const {
    modelName = 'claude-3-sonnet-20240229',
    maxIssues = 5,
  } = options;

  console.log(`Analyzing transcript for repo: ${repoOwner}/${repoName}`);

  const model: LanguageModelV1 = anthropic(modelName);

  const prompt = `
    Analyze the following meeting transcript and create GitHub issues based on the discussion.
    Focus on action items, tasks, and important decisions that need to be tracked.

    # Guidelines
    - Create up to ${maxIssues} issues.
    - Each issue should have a clear, concise title.
    - The body should provide context and any relevant details from the transcript.
    - Assign appropriate labels (e.g., "bug", "feature", "documentation").
    - Suggest assignees based on names mentioned in the transcript.

    # Meeting Transcript
    ${transcript}
  `;

  const result = await generateObject({
    model: model,
    schema: GeneratedIssuesWrapperSchema,
    prompt,
  });

  const generatedIssues = result.object.issues as GeneratedIssue[];
  console.log(`Generated ${generatedIssues.length} issues`);

  return generatedIssues;
}

export async function saveIssuesToGitHub(
  issues: GeneratedIssue[],
  repoOwner: string,
  repoName: string,
  githubToken: string
): Promise<void> {
  const octokit = new Octokit({ auth: githubToken });

  for (const issue of issues) {
    try {
      const response = await octokit.issues.create({
        owner: repoOwner,
        repo: repoName,
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
        assignees: issue.assignees,
      });

      console.log(`Created issue: ${response.data.html_url}`);
    } catch (error) {
      console.error(`Failed to create issue: ${issue.title}`, error);
    }
  }
}
