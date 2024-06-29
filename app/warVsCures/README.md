---
slug: README
name: Interactive Poll Comparing War vs. Clinical Research Spending
featuredImage: 'C:\code\wishonia\app\warVsCures\README.jpg'
description: >-
  Discover the features of the War vs. Cures Poll app, from allocation polls and
  dynamic visualizations to user authentication, personalized experiences, and
  gamification. Engage with the community through social sharing, email
  notifications, and impactful data visualizations.
absFilePath: 'C:\code\wishonia\app\warVsCures\README.md'
---

## Features of the War vs. Cures Poll

1. Desired Allocation Poll: presents the user with a question asking how much they think should be spent on war (Option A) relative to clinical research (Option B). It includes a single slider input to allocate the percentage between the two options, along with two bars above the slider that dynamically visualize the allocation as the user adjusts the slider. The user submits their desired allocation by clicking the "Submit" button, and their response is saved in the browser's local storage.

2. Actual Allocation Poll: asking the user how much they think is actually spent on war (Option A) relative to clinical research (Option B). It includes the same slider input and dynamic bars for visualizing the allocation. The user submits their perceived actual allocation by clicking the "Submit" button, and their response is saved in the browser's local storage.

3. User Authentication: After completing both polls, the user is prompted to log in or register to view the results. They can log in using their email and password or through OAuth with Google. Upon successful login or registration, a new user record is created in the database, and their poll responses are retrieved from local storage and saved in the database.

4. Results Page: After logging in, the user is directed to the Results page, which displays their desired and perceived actual allocation percentages between "War" and "Clinical Research" using bar visualizations. The page also shows the average desired and perceived actual allocation percentages from all users using bar visualizations, allowing the user to compare their responses to the average person. The page includes a link to the petition page.

5. Petition Page: presents information about the petition to shift 1% of military spending to clinical research. It includes a form for users to sign the petition by providing their name, email, address, city, state, and zip code. Upon successful submission, the user is redirected to a “Thank You” page.

6. Thank You Page: displays a message thanking the user for signing the petition and provides information about the next steps or updates related to the petition.

7. Profile Page: displays the user's unique referral link, which they can share with others to invite them to participate in the polls. It also shows a list of users who have signed up using the referral link, indicating whether they have completed the polls and signed the petition.

8. Social Sharing: allows users to easily share their participation in the polls and petition on social media platforms, with pre-populated posts and relevant hashtags.

9. Email Notifications: sends email notifications to users after they complete the polls, sign the petition, or refer someone to the app. Users can opt-out of email notifications if desired.

10. Localization: allows the app to support multiple languages based on the user's browser settings or a language selector, ensuring that the app's content, including questions and instructions, can be easily translated.

11. Gamification: introduces gamification elements to encourage user participation and engagement, such as a points or badge system for completing polls, signing the petition, or referring others. It may also include leaderboards to showcase top referrers or most active participants.

12. Personalized Experience: tailors the app's content and recommendations based on the user's previous interactions and preferences, providing personalized insights or comparisons based on their poll responses and suggesting related petitions or initiatives that align with their interests.

13. Data Visualization: enhances the Results page with interactive data visualizations, such as dynamic charts or graphs, allowing users to explore and compare the poll results based on different criteria, such as demographics or location. It may also provide downloadable reports or infographics for users to share or use in their advocacy efforts.
