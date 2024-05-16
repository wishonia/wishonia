---
title: 'Features Required for a Wishocratic Platform'
description: >-
  Here are the essential features needed for a crowdsourced budget allocation platform that aims to maximize universal preference satisfaction.
# featuredImage: why-reallocation-is-necessary.png
#  date: '2022-11-15'
#author:
#  name: The Office of the President
#  # picture: 
#ogImage:
#  url: 
---

A crowdsourced budget allocation platform aims to maximize universal preference satisfaction by allowing users to propose, vote on, and implement budget allocations for various ideas.

# Features:

1. **Welcome Screen**: The app starts with a welcome screen that introduces the app's purpose, features, and a call-to-action (CTA) button to sign up or log in.

2. **Sign Up/Log In**: Users will be prompted to create an account or log in with their existing credentials. Social media integration can be provided for easy sign-up.

3. **Dashboard**: After a successful login, the user is directed to the dashboard, which provides an overview of ongoing projects, available budget, and upcoming tasks. The dashboard should have clear navigation to other sections of the app.

4. **Create Project**: A button or link should be available on the dashboard to create a new project. This section will include a form for users to input project details, such as project name, description, budget, and deadline.

5. **Project Details**: This screen displays the details of an individual project. It should include the project's title, description, budget, deadline, and a progress bar. Users can view the budget allocation details, contributors, and any attached files.

6. **Budget Allocation**: This section allows users to view the proposed budget allocations, submit their suggestions, and vote on existing proposals. The app should display a visual representation of the budget allocation (e.g., pie chart or bar graph) and a list of proposals ranked by votes.

7. **Propose Allocation**: This screen includes a form for users to suggest budget allocations for different aspects of the project. They can input a title, description, and proposed budget allocation for each item.

8. **Voting**: Users can vote on different budget allocation proposals in this section. They can sort proposals by popularity, date, or other criteria. Users can also view the details of each proposal and leave comments.

9. **Notifications**: This section provides updates on projects, new proposals, and voting results. Users can customize their notification preferences.

10. **Profile**: Users can view and edit their profile information, including name, email, and profile picture. They can also view their past contributions and track their reputation within the app.

11. **Settings**: This section allows users to customize their app experience, such as changing the app's theme, managing notifications, and connecting to social media accounts.

* **Web3 Login**: In the Sign-Up/Log In screen, add the option for users to log in using their web3 wallets (e.g., MetaMask, WalletConnect). This will provide a secure, decentralized login method and facilitate seamless integration with blockchain-based services.

* **Aragon DAO Integration**: The app can be connected to the Aragon framework, which allows for the creation and management of decentralized autonomous organizations (DAOs). In the "Create Project" screen, include an option to "Create DAO" with the project. When a user creates a new project and selects this option, the app will automatically create an Aragon DAO associated with the project. In the "Project Details" screen, display a link to the DAO's governance dashboard on Aragon.

* **Token Creation**: As part of the project creation process, integrate an option for users to create a custom ERC-20 token for their project. In the "Create Project" screen, include a section for users to specify the token name, symbol, and initial supply. Once the project is created, the app will automatically deploy a smart contract on the Ethereum network for the new token.

* **Daily Token Allocation**: Implement a smart contract that distributes one token daily to each active user. In the "Settings" section, include an option for project creators to enable or disable this feature. If enabled, the app will interact with the smart contract to claim tokens for each user daily. In the "Dashboard" and "Profile" screens, display the user's token balance and an option to claim their daily token allocation.
