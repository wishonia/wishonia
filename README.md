# A Decentralized To-Do List for Humanity

## ;TLDR

We want decentralized semi-autonomous todo list for humanity that can:
1. take a large global problem (like dementia)
2. use AI research agents to catalog all possible solutions
3. recursively break down each solution into the smallest atomic tasks
4. complete the incomplete tasks or outsource them to the most efficient person

### Goal
Maximize universal health and happiness given limited resources using collective intelligence and AI agents


### How It Works
1. Collect everyone's preferences through [pairwise comparisons](#aggregated-pairwise-preference-allocation-appa)
2. Combine all responses to create a crowdsourced budget for addressing each problem
3. **AI Research Agents** catalog and rank all possible solutions based on cost-effectiveness
4. **Goal Decomposition AI Agents** break down huge complex solutions into the smallest atomic tasks
5. **Task Agents** identify skilled individuals or AI who can complete each task most efficiently
6. **Monitor Agents** track progress and real-world impact to continuously improve the system

### Core Components
1. Digital Twins: Eight billion AI agents aligned to our individual goals
2. Positron Agents: Prosocial AI for public goods
3. Wishocracy: Resource allocation system based on collective preferences

### Features
1. Quantification of global priorities through pairwise comparisons
2. AI-assisted cataloging of problems and solutions
3. Task decomposition into actionable items
4. Skill-based task matching
5. Reduces wasteful duplication of effort
6. Progress tracking and impact measurement

## The Long Explanation

Say you want to solve a massive global problem like dementia, aging, animal suffering, etc.

**How can you determine the most efficient thing you can do with your time, energy, specific skills and resources to solve it?**

This is a serious question. 
Given the amount of death and suffering, it's probably the most serious question in the world.
So if you have an answer, 
skip reading the rest of this and [share it here](https://github.com/wishonia/wishonia/issues).

Otherwise, 
consider the fact that:
1. our brains have barely evolved since the time of the caveman 
2. we can hold only seven things in our working memory at a time
3. there are thousands of problems, with thousands of potential solutions, and ultimately billions of tasks that need to be completed to solve them

This is the proposed approach to addressing these challenges 
[(please update if you have a better idea)](https://github.com/wishonia/wishonia/edit/main/README.md):

1. List Problems - First, we need a list of global problems we're trying to solve.

2. Prioritize Problems - We don't have infinite resources, so we need a systematic way to determine the share of resources that should be allocated to solve each problem based on our values. 
This can be done using [Randomized Aggregated Pairwise Preference Allocation (APPA)](#aggregated-pairwise-preference-allocation-appa) or a better mechanism.

3. List All Possible Solutions - Use AI **Solution Cataloger Research Agents** (and humans) to research and compile an exhaustive list of potential solutions to a given problem.

4. Break Down Each Solution Into the Smallest Actionable Tasks - Use AI **Goal Decomposition Agents** to recursively break each solution into every single atomic task that needs to be completed to implement the solution.

5. Assign an AI agent to each task, so they can do one of the following:
   - **Identify** who's already working on the task 
   - **Automate** - have an AI agent complete the task (if possible) 
   - **Outsource** - have the agent identify the human or organization who can complete it as cheaply and quickly as possible

# Definitions

**Wishocracy** is a decentralized, modular, and interoperable protocol for optimally allocating societal resources to maximize universal wish fulfillment using collective intelligence. It's meant to be a general-purpose system to be used by any organization like nonprofits, DAOs, businesses, etc.

**Wishonia** is an imaginary magical kingdom meant to illustrate the concept of Wishocracy and test the idea in a simulated virtual world to see how it works.

# Quick Start

1. **Install Dependencies**:

   - [Node.js](https://nodejs.org/en/) v18 or higher (I'd recommend using [NVM](https://github.com/coreybutler/nvm-windows?tab=readme-ov-file) instead so you can easily switch nodejs versions as needed)
   - [pnpm](https://pnpm.io/)
   - [Docker](https://www.docker.com/)

2. **Configure Environment Variables**:

   - Rename .env.example files to .env and configure the environment variables

3. **Start the Database With Docker**:

```sh
docker-compose up -d
```

4. **Install Dependencies**:

```sh
pnpm install
```

5. **Seed the Database**:

Seed the database with default problems and wishes by running tests/seed.test.ts with the following command:

```sh
jest tests/seed.test.ts
```

# Why Are You Doing This?

**The most universal goal we all share is to
maximize the median health and happiness for sentient beings.**

As a human with this goal, you have a limited amount of time, energy, and resources to achieve it.

Unfortunately, there's a 99% chance that you're not doing it optimally.

Either:

- one of the other eight billion people on the planet is already doing what you're doing, and you're totally wasting your resources duplicating effort
- you're simply not doing the best thing that you could be doing, given your skills and resources

## Coordination Failure

The exponential coordination complexity problem illustrates how the lines of communication grow rapidly as more people are involved in a decision-making process.

![](public/img/coordination-complexity-node-graph.jpeg)

Each additional person significantly increases the total number of connections needed for effective communication. 
This complexity makes it impossible to make decisions efficiently, especially as group sizes increase.

![](public/img/coordination-complexity-exponential-graph.jpeg)

However, digital twin agents,
AI representations of individuals with higher cognitive bandwidth perfectly aligned to their preferences, 
can overcome these human limitations.

Agents can continuously analyze data, predict outcomes, and suggest optimal actions, 
ensuring that resources are allocated effectively and that collaborative efforts are maximized. 
This can lead to more informed decision-making, reduced friction in communication, 
and speed up progress towards our collective goals on a global scale.

# Solution: Collective Intelligence and Coordination

The best system we have for maximizing individual health and happiness is the free market.
It's a decentralized system that uses collective intelligence to maximize wish fulfillment.
It works by letting everyone vote with their dollars to determine what everyone should be doing for 40 hours a week.
It's able to coordinate thousands of people who don't even know each other exist to produce goods and services that are more complex than any one person could produce on their own.

The invisible hand kind of turns humanity into a magical genie
that can produce innovations indistinguishable from magic to people who lived before Adam Smith.

https://github.com/mikepsinn/wishonia/assets/2808553/95c056e1-ee9c-4e90-b956-4a2e60d3ad0a

# Public Goods

The free market works well for producing private goods like pencils and iPhones.
However, it doesn't work well for producing public goods like solutions to societal problems.

We make far less progress in solving these problems than we could because:

1. **We Lack a System for Prioritizing Allocation of Scarce Resources** -
   Society has limited resources and thousands of problems.
   We have democratic systems and proposals with up-down votes,
   but they don't force the recognition that resources allocated to one problem are no longer available to solve other problems.
2. **Inefficient Allocation** -
   Resources are often allocated based on political or emotional reasons rather than cost-effectiveness.
3. **Lack of Coordination** -
   There are many organizations working on the same problems without coordination.
   This leads to unimaginable levels of duplicated effort and waste.
4. **Lack of Accountability** -
   There's no way to track the impact of resources allocated to solving problems.
   This makes it difficult to determine what's working and what's not.
5. **Unintended Consequences** -
   Some solutions create new problems or have unintended side effects.
   Without tracking the impact of solutions, it's challenging to adjust resource allocation to minimize these effects.
6. **Limited Cognitive Capacity** -
   Humans have limited cognitive capacity
   and can't effectively weigh the relative importance of thousands of problems
   to determine the percentage of resources that should be allocated to each problem or wish.
7. **Lack of Transparency** -
   There's a lack of transparency in how resources are allocated to solve problems.
   This makes it difficult for citizens to hold decision-makers accountable.
8. **Lack of Incentives** -
   Decision-makers often lack incentives to allocate resources efficiently.
   They may be more focused on short-term political gains than long-term societal benefits.

# The Solution: A Wish Fulfillment System

The core components of a Wish Fulfillment System are:

1. **Problems or Wishes**: A comprehensive list of societal problems that need to be solved or wishes to be fulfilled.
2. **Budget**: A breakdown of the percentage of available resources to allocate to solving each problem/wish.
3. **Solutions**: A comprehensive list of proposed solutions to solve each problem or realize each wish.
   It's also necessary to consider the cost-effectiveness of each solution and unintended side effects.
   A solution may solve multiple problems or create new problems.
4. **Tasks**: A list of SMART (Specific, Measurable, Achievable, Relevant, Time-bound) tasks that need to be completed to implement each solution. Some tasks may contribute to multiple solutions.
5. **Solvers**: People/organizations responsible for completing each task.
6. **Progress**: Tracking the impact of each solution and adjusting resource allocation as needed.
7. **Results**: The outcomes of each solution and the overall positive and negative impact on society.

# The Wish Fulfillment Process

## Step 1. Catalog Wishes or Problems

Create a comprehensive list of societal goals or problems that need to be solved.

## Step 2. Create a Budget

Determine how much of our scarce resources should be allocated to solving each problem or fulfilling each wish.

There are a number of ways to do this like democracy and crowdfunding campaigns but they suffer from various limitations:

- **Democracy:** Some interests of representatives do not match the interests of all citizens. Additionally, representatives have limited knowledge and cognitive capacity to effectively weigh the relative importance of thousands of wishes.
- **Crowdfunding Campaigns:** People vote with their dollars to determine the allocation of resources. However, again humans have limited cognitive capacity to effectively weigh the relative importance of thousands of wishes.

### Aggregated Pairwise Preference Allocation (APPA)

A possible solution to this is **Aggregated Pairwise Preference Allocation (APPA)**.
This involves showing everyone a random pair of wishes or problems
and asking them to allocate a percentage of available resources to each.

![](public/img/screenshots/problem-allocation.png)

By aggregating lots of pairwise allocations from lots of people, we may be to determine the percentage of available resources that should be allocated to each problem.

![](public/img/screenshots/problem-allocation-list-with-heading.png)

## Step 3: Create a List of Solutions

Allow people or AI agents to submit proposed solutions for each problem
or wish to create a comprehensive list of proposed strategies to fulfill each wish or solve each problem.

## Step 4: Evaluate Solutions

Again, use collective intelligence through Aggregated Pairwise Preference Allocation to determine the percentage of problem resources that should be allocated to each solution.
The evaluators should take into account the:

- **cost-effectiveness** of each solution
- **positive side effects** of the solution in terms of solving other problems
- **negative side effects** of the solution in terms of creating new problems

## Step 5. Create Tasks

Decompose each solution into a list of atomic tasks that need to be completed.
Each task should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound).

Some tasks may contribute to multiple solutions,
so it's important to link tasks to multiple solutions so that they are not duplicated and that costs are shared across solutions.

## Step 6. Create Prizes and Incentives

Offer rewards for completing tasks to incentivize the completion of tasks. This not only motivates individuals or AI agents to undertake and complete tasks but also promotes cost-sharing between multiple organizations. By doing so, we can prevent wasteful duplication of effort and resources, as multiple organizations can contribute to the reward pool for tasks that align with their objectives.

Possible ways to decide on the amount of the prize include:

- **Bidding:** People or AI agents bid on the tasks by submitting the amount they would be willing to accept to complete the task. This creates a competitive environment that can lead to more efficient task completion.
- **AI Prediction Markets:** Use AI to predict the cost of completing the task and offer a prize that is slightly higher than the predicted cost. This ensures that the task is attractive enough to be undertaken, while also keeping costs under control.

## Step 6. Evaluate Submissions

Evaluate the completed tasks to determine if they meet the criteria for completion and award the prize.

## Step 7. Monitor Progress and Impact

Track the impact of each solution.
Evaluate the outcomes of each solution and the overall positive and negative impact on society.

## Step 8. Feedback and Iterative Improvement

Provide impact data to people making pairwise allocations to help them make better decisions in the future.
This will enable continuous improvement in the allocation of resources to maximize wish fulfillment.

# How is Wishocracy Different from Other Systems?

- **Aggregated Pairwise Preference Allocation (APPA)**: This mechanism allows for scalable surfacing of the "wisdom of crowds" in budgeting resources across competing wishes/problems and evaluating potential solutions.
- **Iterative Feedback Loops**: The system should incorporate continuous improvement of allocations based on impact data and participant input.
- **Decentralized Task Allocation**: By decomposing solutions into atomic tasks and cost-sharing across multiple organizations, Wishocracy tries to minimize duplication of effort and maximize efficiency.

# Protocol

## Protocol Primitives

The current models are available in the [Prisma schema here](prisma/schema.prisma).
However, we'll ultimately want to define these as JSON schemas and switch to a decentralized data store for interoperability.

1. **Problem Statement (WPS)**

- Globally unique identifier
- Title (short description)
- Detailed description
- Category tags
- Creation timestamp
- Creator ID (DID or public key)

2. **Pairwise Allocation Vote (PAV)**

- Voter ID (DID or public key)
- Wish/Problem A ID
- Wish/Problem B ID
- Allocation percentage for A
- Allocation percentage for B
- Timestamp

3. **Solution Proposal (SP)**

- Globally unique identifier
- Associated Wish/Problem ID(s)
- Title
- Detailed description
- Estimated cost
- Estimated impact
- Category tags
- Creation timestamp
- Creator ID

4. **Task Definition (TD)**

- Globally unique identifier
- Associated Solution Proposal ID(s)
- SMART task specification
  - Title
  - Detailed description
  - Measurable completion criteria
  - Due date
- Estimated cost
- Dependent Task IDs
- Category tags
- Creation timestamp
- Creator ID

5. **Task Allocation Commitment (TAC)**

- Allocated Task Definition ID
- Solver ID
- Committed budget
- Acceptance timestamp

6. **Task Submission (TS)**

- Allocated Task Definition ID
- Solver ID
- Deliverable data/proof
- Submission timestamp

7. **Task Evaluation Result (TER)**

- Task Submission ID
- Evaluator ID
- Evaluation score
- Evaluation notes
- Evaluation timestamp

8. **Impact Report (IR)**

- Associated Solution Proposal ID(s)
- Reporting period
- Impact metrics
  - Quantitative measures
  - Qualitative outcomes
- Associated Task Submission IDs
- Report timestamp
- Reporter ID

# Integration and Interoperability

These primitives can be represented as standardized data schemas that can be stored, queried, and interlinked across disparate systems via decentralized data networks like IPFS, GUN, Ceramic, etc.

Existing task management or resource allocation platforms can map their internal data models to these common primitives, and publish/subscribe to relevant data streams. This allows different systems to coordinate on a global "task graph" without tight coupling.

Some example integration patterns:

- A DAO's internal project management system can automatically generate Task Definitions from its own tasks/issues/bounties and publish them for external contributors to submit Task Allocation Commitments and Task Submissions.
- A public goods crowdfunding platform can post funded initiatives as Solution Proposals, and allocate a portion of the raised funds to Task Definitions drawn from Wishocracy's task graph.
- An analytics platform can aggregate Impact Reports from multiple sources to surface insights on global resource allocation efficiency and identify neglected areas or emerging opportunities.

By defining these common primitives and leveraging decentralized data networks, Wishocracy can serve as a connective tissue that enables various task management and resource allocation systems to interoperate towards the shared goal of optimizing global effort, without requiring disruptive changes to their existing workflows.

# General Functions of Wishocracy

1. **Wish Management System**: A system for creating, categorizing, and prioritizing wishes or problems that need to be solved.
2. **Budget Allocation System**: A system for determining how much of our scarce resources should be allocated to solving each problem or fulfilling each wish.
3. **Solution Management System**: A system for creating, categorizing, and evaluating proposed solutions to solve each problem or fulfill each wish.
4. **Task Management System**: A system for decomposing each solution into a list of atomic tasks that need to be completed.
5. **Wisher Relationship Management (WRM) System**: A system for tracking the relationship between wishes, solutions, tasks, and wishers. This is similar to a Customer Relationship Management (CRM) system but for global coordination between Wishers.

# Digital Twins

We'd like to allow people to create Digital Twins of themselves in the simulated World of Wishonia.
Digital Twins are meant to be autonomous agents to work together to find positive-sum games,
figure out how their analog real-world counterparts can work together to maximize wish fulfillment.
They should also be able to use tools and interact with the world to automate the production of public goods.

A Digital Twin is a digital representation of a person that is defined by their:

- **Wishes**: What they want to accomplish in the world
- **Skills**: What they're good at
- **Resources**: What they have to offer
- **Interests**: What they're interested in
- **Time**: How much time they have to offer

The basic technical ingredients of a digital twin are:

- **A Large Language Model**: To understand and generate text
- **A Knowledge Graph**: To store and reason about the person's wishes, skills, resources, interests, time, reputation, network, location, and language
- **A Vector Database**: To store and query the person's knowledge graph using retrieval

# What's Next?

1. **Integrate Existing Public Goods Protocols and Platforms**:
   Integrate protocols that aim to optimize resource allocation such as Gitcoin Grants, HyperCerts, and others.
2. **Domain Application**: Exploring applications of Wishocracy within various contexts such as organizations, DAOs, governments, or global scale initiatives.
3. **Integration with Existing Task Management Systems**: Developing integrations with existing task management systems to facilitate task import, syncing, creation, assignment, and tracking.

# [Frequently Asked Questions](public/docs/faq.md)

## GitHub Action: Improve Issues

The GitHub action defined in `.github/workflows/new-issue.yml` is designed to improve the quality of issues in this repository. It includes a job named `improve-issues` which runs on `ubuntu-latest` and performs the following steps:

1. **Checkout Repository**: Uses the `actions/checkout@v2` action to checkout the repository.
2. **Set Up Node.js**: Uses the `actions/setup-node@v2` action to set up Node.js with version `14`.
3. **Install Dependencies**: Runs `npm install` to install the necessary dependencies.
4. **Run Issue Improvement Script**: Runs `npm run improve-issues` to execute the issue improvement script.

### Configuration

To configure this action, you need to set up the following secrets in your GitHub repository:

- `OPENAPI_KEY`: The OpenAI API key used by the issue improvement script.

To add a secret to your repository:

1. Go to the repository on GitHub.
2. Click on `Settings`.
3. In the left sidebar, click on `Secrets`.
4. Click on `New repository secret`.
5. Add the secret with the name `OPENAPI_KEY` and the corresponding value.

