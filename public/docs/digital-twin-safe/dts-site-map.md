---
slug: dts-site-map
name: Comprehensive Guide to the Digital Twin Safe Platform Sitemap
featuredImage: /docs/digital-twin-safe/dts-site-map.jpg
description: >-
  Dive into the comprehensive **Digital Twin Safe Sitemap** guide, detailing
  essential pages from the Home Page, Login/Signup, personalized Dashboard, data
  import synchronization, chat interface, API management, documentation, user
  settings, support, and community engagement.
---
### Digital Twin Safe Sitemap

1. **Home Page (URL: `https://example.com/`)**
   - **Description:** This is the landing page where users get an overview of the platform. It includes information about the digital twin concept, key features, user benefits, and calls to action for signing up or logging in.

2. **Login/Signup Page**
   - **Description:** This page allows users to sign up for an account or log in using their Google or GitHub credentials. It integrates NextAuth for authentication and security.

3. **Dashboard (URL: `/{user_name}/dashboard`)**
   - **Description:** After logging in, users are directed to their personalized dashboard. Here, they can view their digital twin, manage settings, and access various features such as data import, API key management, and billing information.

4. **Data Import Page (URL: `/{user_name}/admin/import`)**
   - **Description:** This section allows users to schedule and manage data imports from Google Drive, OneDrive, Notion, and health apps. Users can set import frequency and select the types of data they wish to sync.  They should also be able to manually upload files to be stored in their digital twin's GitHub repository.  They should also be able to paste URLs to web pages to have the data scraped and stored in their digital twin's GitHub repository.

5. **GitHub Repository Synchronization**
   - **Description:** Integrated within the user dashboard, this feature enables synchronization of user data with a GitHub repository. It supports markdown and CSV formats and allows for version control of the digital twin's data.

6. **Chat Interface (URL: `/{user_name}/chat`)**
   - **Description:** This page features a chat UI where users can interact with their digital twin. It allows for real-time communication and can be customized in terms of the digital twin's appearance and responses.

7. **API Management (URL: `/{user_name}/api`)**
   - **Description:** Users can manage their API key here, monitor usage, and access billing information. This page also integrates Stripe for payment processing.

8. **API Documentation (URL: `/{user_name}/api/docs`)**
   - **Description:** Provides comprehensive and interactive OpenAPI documentation. It allows users and external developers to understand how to interact with the API.

9. **SDK Auto-generation**
   - **Description:** This is an automated process triggered by GitHub actions to generate SDKs in various languages based on the OpenAPI specification. It’s not a user-facing page but an important part of the backend infrastructure, ensuring that SDKs are up-to-date with the latest API specifications.

10. **OAuth2 Server Integration**
    - **Description:** This feature, integrated into the user dashboard, allows users to manage third-party access to their digital twin data.  They should be able to see which applications have access and revoke permissions if needed.  They should also be able to grant access to new applications.

11. **Settings and Customization (Accessible via Dashboard)**
    - **Description:** This section lets users customize their digital twin's appearance and personality, manage privacy settings, and configure notification preferences.  See the [Digital Twin Data Model](digital-twin-data-model.md) and [Prisma Schema](../../../prisma/schema.prisma) for more details.

12. **User Support and Tutorial**
    - **Description:** A resource section with tutorials on creating and managing digital twins, and a support system for user inquiries.

13. **Feedback and Community Forum**
    - **Description:** A space for users to provide feedback and engage with other users in the community, sharing tips and experiences.

14. **Data Visualization Tools (Accessible via Dashboard)**
    - **Description:** Tools for users to visualize and interact with the data collected by their digital twin.

15. **File Manager (URL: `/{user_name}/files`)** - The user should be able to view and manage the files in their digital twin's GitHub repository.  They should be able to create new files, edit existing files, and delete files.

16. **Web Pages** - Each markdown file in the user's digital twin GitHub repository should be rendered as a web page at `/{user_name}/files/{file_name}`.  The user should be able to share these web pages with others.

17. **Settings** (URL: `/{user_name}/settings`) -
    The user should be able to manage their account settings,
    including their name, email address, password, and profile picture.
    They should also be able to manage their notification preferences.

18. **Agents** (URL: `/{user_name}/agents`) - A list of agents that have been created.

19. **Agent Settings** (URL: `/{user_name}/agents/{agent_id}`) - The user should be able to view and manage the settings for each agent.  This includes the API key (OpenAI, Claude, Gemini, etc.) to be used by the agent, the agent's name, and the agent's description.  It should also allow the user to enter the credentials for the vector database to be used by the agent (i.e. Pinecone).

20. **Agent Data Sources** (URL: `/{user_name}/agents/{agent_id}/data-sources`) - The user should be able to view and manage the data sources for each agent.  This includes the data source type (GitHub, Google Drive, OneDrive, Notion, etc.), the data source name, and the data source description.

21. **Agent Embed** (URL: `/{user_name}/agents/{agent_id}/embed`) - This page should provide the user with an embed code that they can use to embed the agent on their website or blog.  It should also include a link to download the agent's SDK and WordPress plugin.

22. **Agent Chat Interface** (URL: `/{user_name}/agents/{agent_id}/chat`) - This page should provide the user with a chat interface to interact with the agent.

23. **Agent API** (URL: `/{user_name}/agents/{agent_id}/api`) - This page should provide the user with an API key that they can use to interact with the agent programmatically.

24. **Agent Documentation** (URL: `/{user_name}/agents/{agent_id}/docs`) - This page should provide the user with documentation on how to interact with the agent's API.

25. **Agent Usage** (URL: `/{user_name}/agents/{agent_id}/usage`) - This page should provide the user with information on the agent's usage and billing. 

26. **Agent Logs** (URL: `/{user_name}/agents/{agent_id}/logs`) - This page should provide the user with logs of the agent's activity such as data ingestion, processing, and interactions and the source of the interactions

27. **Agent API Keys** (URL: `/{user_name}/agents/{agent_id}/api-keys`) - This page should provide the user with a list of API keys that have been generated for the agent to be used in the embedding, chat interface, and API.

