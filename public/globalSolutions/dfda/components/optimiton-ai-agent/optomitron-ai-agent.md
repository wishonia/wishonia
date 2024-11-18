# Optimitron AI Agent

Optimitron is an AI agent that lives in your PersonalFDA node that uses causal inference to estimate how various factors affect your health.

![data-import-and-analysis.gif](../../images/data-import-and-analysis.gif)

Optimitron is an AI assistant that asks you about your symptoms and potential factors. Then she applies pharmacokinetic predictive analysis to inform you of the most important things you can do to minimize symptom severity.

[![Click Here for Demo Video](../../images/optimitron-ai-assistant.png)](https://youtu.be/hd50A74o8YI)

[Or Try the Prototype Here](https://demo.curedao.org/app/public/#/app/chat)

#### Data Analysis

Currently, we've implemented causal inference analysis of sparse time series data that takes into account onset delays and other factors.

![causal-inference-vertical.svg](https://static.crowdsourcingcures.org/dfda/components/data-analysis/causal-inference-vertical.svg)

We're working on implementing a more robust pharmacokinetic predictive model control recurrent neural network.

Ideally, Optimitron AI agent will be able to further improve the precision and accuracy of the real-time recommendations over time by leveraging reinforcement learning and community contributions.

[👉 Learn more about the data analysis here...](../data-analysis/data-analysis.md)
