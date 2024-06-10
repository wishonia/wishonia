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

3. **Dashboard (URL: `https://wishonia.love/{user_name}`)**
   - **Description:** After logging in, users are directed to their personalized dashboard. Here, they can view their digital twin, manage settings, and access various features such as data import, API key management, and billing information.

4. **Data Import Page (URL: `https://wishonia.love/{user_name}/admin/import`)**
   - **Description:** This section allows users to schedule and manage data imports from Google Drive, OneDrive, Notion, and health apps. Users can set import frequency and select the types of data they wish to sync.  They should also be able to manually upload files to be stored in their digital twin's GitHub repository.  They should also be able to paste URLs to web pages to have the data scraped and stored in their digital twin's GitHub repository.

5. **GitHub Repository Synchronization**
   - **Description:** Integrated within the user dashboard, this feature enables synchronization of user data with a GitHub repository. It supports markdown and CSV formats and allows for version control of the digital twin's data.

6. **Chat Interface (URL: `https://wishonia.love/{user_name}`)**
   - **Description:** This page features a chat UI where users can interact with their digital twin. It allows for real-time communication and can be customized in terms of the digital twin's appearance and responses.

7. **API Management (URL: `https://wishonia.love/{user_name}/api`)**
   - **Description:** Users can manage their API key here, monitor usage, and access billing information. This page also integrates Stripe for payment processing.

8. **API Documentation (URL: `https://wishonia.love/{user_name}/api/docs`)**
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

15. **File Manager (URL: `https://wishonia.love/{user_name}/files`)** - The user should be able to view and manage the files in their digital twin's GitHub repository.  They should be able to create new files, edit existing files, and delete files.

16. **Web Pages** - Each markdown file in the user's digital twin GitHub repository should be rendered as a web page at `https://wishonia.love/{user_name}/files/{file_name}`.  The user should be able to share these web pages with others.

Each page is designed to offer a user-friendly experience while providing all necessary functionalities to create, manage, and interact with a digital twin. The sitemap ensures that the website is structured logically, making it easy for users to navigate and access the various features.
