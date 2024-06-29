import { ApiCheck, AssertionBuilder } from "checkly/constructs"

new ApiCheck("global-problems-api-check-1", {
  name: "Global Problems API",
  alertChannels: [],
  degradedResponseTime: 10000,
  maxResponseTime: 20000,
  request: {
    url: "https://wishonia.love/api/globalProblems",
    method: "GET",
    followRedirects: true,
    skipSSL: false,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      //AssertionBuilder.jsonBody('$[0].id').isNotNull(),
    ],
  },
  runParallel: true,
})
