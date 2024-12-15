import { ToolType } from "@prisma/client"
import { createTool, stringifyMetadata } from "./base"

const metadata = {
  apiVersion: "v3",
  rateLimit: 5000,
  requiresAuth: true
};

export const GITHUB_TOOL = createTool({
  name: "GitHub API",
  type: ToolType.GITHUB,
  description: "Access to GitHub API for searching repositories and users",
  metadata: stringifyMetadata(metadata),
  functions: {
    show_user_profile_ui: {
      name: "show_user_profile_ui",
      description: "Show the found user profile UI",
      parameters: [{
        name: "username",
        description: "The username of the user to search for",
        type: "string",
        required: true
      }]
    },
    show_user_list_ui: {
      name: "show_user_list_ui",
      description: "Show the found user list UI",
      parameters: [{
        name: "query",
        description: "The query to search for users",
        type: "string",
        required: true
      }]
    },
    show_repository_ui: {
      name: "show_repository_ui",
      description: "Show the found repositories UI",
      parameters: [{
        name: "query",
        description: "The query to search for repositories",
        type: "string",
        required: true
      }]
    },
    show_readme_ui: {
      name: "show_readme_ui",
      description: "Show the found Readme.md UI",
      parameters: [{
        name: "repo",
        description: "The repo to search for",
        type: "string",
        required: true
      }, {
        name: "owner",
        description: "The owner of the repo",
        type: "string",
        required: true
      }]
    }
  }
}) 