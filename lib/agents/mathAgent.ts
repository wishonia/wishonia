import {generateText, tool} from "ai";
import {openai} from "@ai-sdk/openai";
import {z} from "zod";
import * as mathjs from "mathjs";

export async function doMath(problem: string) {
    console.log(`PROBLEM: ${problem}`);
    const { text: answer } = await generateText({
        model: openai('gpt-4-turbo'),
        system:
            'You are solving math problems. ' +
            'Reason step by step. ' +
            'Use the calculator when necessary. ' +
            'Only return a single number as the result.  No talking',
            //+
           // 'When you give the final answer, ' +
            //'provide an explanation for how you arrived at it.',
        prompt: problem,
        tools: {
            calculate: tool({
                description:
                    'A tool for evaluating mathematical expressions. ' +
                    'Example expressions: ' +
                    "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
                parameters: z.object({ expression: z.string() }),
                execute: async ({ expression }) => mathjs.evaluate(expression),
            }),
        },
        maxToolRoundtrips: 10,
    });

    console.log(`ANSWER: ${answer}`);
    // convert the answer to a number
    return parseFloat(answer);
}