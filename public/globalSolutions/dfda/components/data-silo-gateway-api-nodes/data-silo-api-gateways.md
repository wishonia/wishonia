## Data Silo API Gateway Nodes

![dfda-gateway-api-node-silo.png](https://static.crowdsourcingcures.org/dfda/components/data-silo-gateway-api-nodes/dfda-gateway-api-node-silo.png)

FDAi Gateway API Nodes make it easy for data silos, such as hospitals and digital health apps, to let people export and save their data locally in their [PersonalFDA Nodes](../../home.md#2-personalfda-nodes). 

### Requirements
   - **OAuth2 Protected API:** Provides a secure, OAuth2-protected API for people to easily access their data.
   - **Personal Access Token Management** - Individuals should be able to create labeled access tokens that they can use to access their data.  They should be able to label their access tokens and monitor the usage of each token.  They should also be able to revoke access tokens at any time and set an expiration date.
   - **Developer Portal:** Developer portal for data silos to easily register and manage their 3rd party application, so they can allow users to share data with their application.
   - **OpenAPI Documentation:** Provide OpenAPI documentation for the API, making it easy for data silos to integrate.
   - **Software Development Kits (SDKs):** Provide SDKs for popular programming languages to make it easy for developers to integrate the API into their applications.
   - **Data Encryption:** Implement robust encryption protocols to safeguard sensitive health data.
   - **HIPAA and GDPR Compliance:** Ensure compliance with HIPAA and GDPR privacy regulations.
   - **Multiple Data Format Options:** Provide multiple data format options for data export, including CSV, JSON, and XML.
   - **Data Structure Options:** Client applications should be able to request should be able to request data in various formats such as FHIR, HL7, and the Common Data Model (CDM).

### Potential Implementations, Components or Inspiration

There's a monolithic implementation of this in [apps/dfda-1](https://github.com/FDA-AI/FDAi/tree/develop/apps/dfda-1).

Please make a pull request and add links to any other open-source projects that could better fulfill this role.
