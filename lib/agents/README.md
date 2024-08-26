# LLM Pricing

See current list of providers at
[https://sdk.vercel.ai/providers/ai-sdk-providers](https://sdk.vercel.ai/providers/ai-sdk-providers)


Here is a comparison table of the pricing for API requests from OpenAI, Anthropic's Claude, and Google's AI LLMs based on the available information:

| Provider      | Model            | Context Length | Input Price per 1K Tokens | Output Price per 1K Tokens |
|---------------|------------------|----------------|---------------------------|----------------------------|
| **OpenAI**    | GPT-4o           | 128K           | $0.0025                   | $0.01                      |
|               | GPT-4o Mini      | 128K           | $0.00015                  | $0.0006                    |
|               | GPT-4 Turbo      | 128K           | $0.01                     | $0.03                      |
|               | GPT-4            | 8K             | $0.03                     | $0.06                      |
|               | GPT-3.5 Turbo    | 16K            | $0.0005                   | $0.0015                    |
| **Anthropic** | Claude 3 Sonnet  | 200K           | $0.003                    | $0.015                     |
|               | Claude 3 Opus    | 200K           | $0.015                    | $0.075                     |
| **Google**    | PaLM 2           | 8K             | $0.002                    | $0.002                     |
|               | Gemini 1.5 Flash | 1M             | $0.0007                   | $0.0021                    |
|               | Gemini 1.5 Pro   | 1M             | $0.007                    | $0.021                     |

### Key Points:
- **OpenAI** offers a range of models with varying context lengths and pricing, with GPT-4o being one of the more expensive options due to its advanced capabilities.
- **Anthropic's Claude** models, such as Claude 3 Sonnet and Claude 3 Opus, have higher context lengths and are priced competitively for their input and output token processing.
- **Google's AI** models, including PaLM 2 and Gemini, provide options with large context lengths and competitive pricing, especially for high-volume token processing.

These prices are indicative of the cost per 1,000 tokens processed, which includes both input and output tokens. The choice of model and provider should depend on the specific requirements of your application, including the complexity of tasks and budget constraints.

Citations:
[1] https://markovate.com/openai-llm-api-pricing-calculator/
[2] https://yourgpt.ai/tools/openai-and-other-llm-api-pricing-calculator
[3] https://docsbot.ai/tools/gpt-openai-api-pricing-calculator
[4] https://gptforwork.com/tools/model-comparator