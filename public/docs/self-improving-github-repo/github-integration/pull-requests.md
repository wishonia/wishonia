---
slug: pull-requests
name: Managing Documentation with Pull Requests in Positron Network Agent
featuredImage: /docs/roadmap/self-improving-github-repo/github-integration/pull-requests.jpg
description: >-
  Learn how the Positron Network Architect Agent uses a structured pull request
  process to manage and update documentation efficiently with automated and
  human review steps for seamless collaboration.
---
# Pull Requests

The Architect Agent uses pull requests to manage documentation. This section provides an overview of the pull request process and its usage in the agent.

## Pull Request Process

The Architect Agent uses pull requests to manage documentation. This section provides an overview of the pull request process and its usage in the agent.

### Creating a Pull Request

The agent creates a pull request when it needs to update the documentation. It uses the following steps to create a pull request:

1. Create a branch for the pull request.
2. Make the necessary changes to the documentation.
3. Commit the changes to the branch.
4. Push the branch to the remote repository.
5. Create a pull request on GitHub.
6. A webhook or GitHub Action triggers a critic agent to review and critique the pull request.
7. Human feedback - Humans can review the pull request and support or argue with the various Critic and Architect agents.  
8. If the human reviewers like the changes, they can be merged. 
9. If the human requests changes, the Architect agent will make the changes and the process will start over.

