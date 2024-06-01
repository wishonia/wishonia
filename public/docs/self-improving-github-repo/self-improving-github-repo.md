---
slug: self-improvement
name: 'Building a Self-Improving GitHub Repository: How to Get Started'
featuredImage: /docs/roadmap/positron-network/self-improvement.jpg
description: >-
  Discover how to set up a self-improving GitHub repository, leveraging
  autonomous agents for continuous monitoring and development. Learn the
  decision-making process, agents' roles, and the essential initial tasks to
  establish a repository that evolves autonomously. Maximize efficiency and
  streamline contributions!
---
# Self-Improving GitHub Repository

The goal is to turn this project is to create a self-improving GitHub repository.

We need to index the repository, issues, and comments to create a tool to allow the agents to know what's been built already and provide links to files and ask questions about the project. This will be necessary for all the coding and project management agents.

To do this we need to create tables in the Prisma schema that mirror the Github issues API response including comments and related models. We should prefix these schema tables with `github_` to avoid conflicts with other tables.  I guess we can just keep the snake_case naming convention for the fields to maintain consistency with the Github API and simplify insertion?

For generating the embeddings we can either create an `embeddings` field on the table or a separate embeddings table(s) that can be linked to the GitHub tables.

Then we'll need to create a sync job to update the tables and embeddings on a regular basis.

We'll want a function for querying the embeddings. This will be used in
- Agents for commenting on issues, adding context, generating code, etc.
- An API endpoint for querying the embeddings
- A chat web interface for querying the embeddings

The function should return the top N most relevant chunks of text from the issue, comments, and related files and links to the sources.

# References
- https://github.com/run-llama/LlamaIndexTS/blob/main/examples/anthropic/agent.ts
- https://github.com/marketplace?type=actions&query=todo+
- https://dosu.dev/
- https://js.langchain.com/v0.1/docs/expression_language/cookbook/retrieval/
- https://js.langchain.com/v0.1/docs/expression_language/cookbook/tools/
- https://github.com/Codium-ai/pr-agent/blob/main/pr_agent/tools/pr_code_suggestions.py

# Required Agents

To design a process where AI agents manage a GitHub project, automatically plan and prioritize development, and create and make helpful comments on GitHub issues, we would need several specialized agents with focused objectives. Here's a breakdown of the required agents and their objectives:

1. Project Manager Agent:
   - Objective: Oversee the entire project and coordinate the activities of other agents.
   - Responsibilities:
      - Monitor the overall progress of the project.
      - Communicate with stakeholders and provide project updates.
      - Ensure smooth collaboration between different agents.

2. Issue Triager Agent:
   - Objective: Analyze and prioritize incoming GitHub issues.
   - Responsibilities:
      - Assess the urgency and importance of each issue.
      - Categorize issues based on their type (bug, feature request, etc.).
      - Assign priority labels to issues (e.g., high, medium, low).
      - Route issues to the appropriate agent for further action.

3. Requirements Analyzer Agent:
   - Objective: Analyze and clarify requirements from GitHub issues.
   - Responsibilities:
      - Review issue descriptions and comments to understand user requirements.
      - Identify missing or ambiguous information in issue descriptions.
      - Engage with issue reporters to gather additional details when needed.
      - Document clear and concise requirements for each issue.

4. Solution Architect Agent:
   - Objective: Design and propose technical solutions for GitHub issues.
   - Responsibilities:
      - Analyze requirements and constraints for each issue.
      - Propose high-level architectural designs and implementation approaches.
      - Identify potential risks and dependencies associated with proposed solutions.
      - Collaborate with the Development Team Agent to refine and finalize solutions.

5. Development Team Agent:
   - Objective: Manage the development process and assign tasks to developers.
   - Responsibilities:
      - Break down GitHub issues into smaller, manageable tasks.
      - Assign tasks to individual developers based on their skills and availability.
      - Monitor the progress of development tasks and provide guidance when needed.
      - Ensure code quality and adherence to project standards.

6. Code Reviewer Agent:
   - Objective: Review and provide feedback on code changes.
   - Responsibilities:
      - Perform code reviews for pull requests.
      - Ensure code changes meet project guidelines and best practices.
      - Provide constructive feedback and suggestions for improvement.
      - Approve or request changes to pull requests based on the review.

7. Issue Commenter Agent:
   - Objective: Provide helpful comments and updates on GitHub issues.
   - Responsibilities:
      - Monitor issue discussions and provide timely responses.
      - Offer guidance and troubleshooting suggestions to issue reporters.
      - Keep issue reporters informed about the progress and status of their issues.
      - Close resolved issues and provide explanations for the resolution.

8. Continuous Integration (CI) Agent:
   - Objective: Automate the build, testing, and deployment processes.
   - Responsibilities:
      - Configure and maintain the CI pipeline.
      - Trigger automated builds and tests whenever code changes are pushed.
      - Report build and test results to the relevant agents.
      - Deploy successful builds to the appropriate environments.

9. Documentation Agent:
   - Objective: Maintain and update project documentation.
   - Responsibilities:
      - Generate and update API documentation based on code changes.
      - Maintain user guides, tutorials, and project wiki.
      - Collaborate with other agents to ensure documentation accuracy and completeness.

10. Prisma Schema Manager Agent:
- Objective: Manage and maintain the Prisma schema for the project.
- Responsibilities:
   - Design and define the database schema using Prisma's schema language.
   - Handle schema migrations and database updates.
   - Ensure the schema is consistent with the application's data requirements.
   - Collaborate with the Development Team Agent to incorporate schema changes.

11. API Endpoint Generator Agent:
- Objective: Generate API endpoints based on the project's requirements.
- Responsibilities:
   - Analyze the project's feature requirements and identify necessary API endpoints.
   - Design and define the structure and behavior of API endpoints.
   - Generate code for the API endpoints, including request handling and response formatting.
   - Integrate the generated endpoints with the project's backend framework.

12. UI Component Generator Agent:
- Objective: Generate UI components for the project's features.
- Responsibilities:
   - Analyze the project's UI design and feature requirements.
   - Generate reusable UI components based on the design specifications.
   - Ensure the generated components are modular, responsive, and accessible.
   - Integrate the generated components into the project's frontend framework.

# Agent Tools

To enable effective collaboration and automation among the AI agents, they will require a set of shared tools and capabilities. Here's a list of the essential tools and features:

1. Repository Querying Tool with RAG (Retrieval-Augmented Generation):
   - Enables agents to query and retrieve relevant information from the project's codebase and documentation.
   - Utilizes RAG techniques to generate accurate and contextually relevant responses based on the retrieved information.
   - Supports natural language queries and code-specific searches.

2. Issue Creation and Management Tool:
   - Allows agents to create, assign, and manage GitHub issues.
   - Supports automatic issue creation based on predefined templates and criteria.
   - Enables agents to update issue status, add comments, and attach relevant files or screenshots.

3. Issue Search and Filtering Tool:
   - Provides powerful search and filtering capabilities for GitHub issues.
   - Allows agents to search issues based on keywords, labels, assignees, status, and other relevant criteria.
   - Enables agents to quickly find and prioritize issues based on their specific requirements.

4. Pull Request Management Tool:
   - Facilitates the creation, review, and merging of pull requests.
   - Allows agents to automatically create pull requests based on completed tasks or feature branches.
   - Supports code review workflows, enabling agents to provide feedback and approve or request changes.

## Decision Tree

Here's a simplified version of the decision-making process at each stage,
considering various uncertainties and limitations:

1. **User Creates Issue**
    - **Is the issue clear?**
        - Yes: Proceed to webhook.
        - No: Ask clarifying questions.

2. **Webhook Triggered**
    - **Can the model process the issue?**
        - Yes: Conduct research and development.
        - No: Create an issue for human assistance.

3. **Research and Development**
    - **Is relevant information found?**
        - Yes: Develop code and documentation.
        - No: Create a bounty for the task.

4. **Create Pull Request**
    - **Is the pull request approved by humans?**
        - Yes: Merge and execute.
        - No: Modify based on feedback.

5. **Merge and Execute**
    - **Does the code execute successfully?**
        - Yes: Store output and analyze for self-improvement.
        - No: Create an issue for debugging.

6. **Continuous Self-Improvement**
    - **Are improvements identified?**
        - Yes: Implement improvements.
        - No: Continue monitoring.

7. **Handling Limitations**
    - **Can the system address its limitations?**
        - Yes: Implement solutions.
        - No: Seek human developer intervention.

### Decision Tree Diagram

```mermaid
graph TD
    A[User Creates Issue] -->|Is the issue clear?| B[Issue Clear]
    B -->|Yes| C[Webhook Triggered]
    B -->|No| D[Ask Clarifying Questions]
    C -->|Can the model process the issue?| E[Model Processes Issue]
    E -->|Yes| F[Research and Development]
    E -->|No| G[Create Issue for Human Assistance]
    F -->|Is relevant information found?| H[Relevant Information Found]
    H -->|Yes| I[Develop Code and Documentation]
    H -->|No| J[Create Bounty for Task]
    I -->|Is the pull request approved?| K[Pull Request Approved]
    K -->|Yes| L[Merge and Execute]
    K -->|No| M[Modify Based on Feedback]
    L -->|Does the code execute successfully?| N[Code Executes Successfully]
    N -->|Yes| O[Store Output and Self-Improve]
    N -->|No| P[Create Issue for Debugging]
    O -->|Are improvements identified?| Q[Improvements Identified]
    Q -->|Yes| R[Implement Improvements]
    Q -->|No| S[Continue Monitoring]
    R --> T[End]
    S --> T
    P --> T
    M --> T
    J --> T
    G --> T
    D --> T

```