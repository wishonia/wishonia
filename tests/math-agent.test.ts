/**
 * @jest-environment node
 */
import {doMath} from "@/lib/agents/mathAgent";

describe('Math Agent', () => {
    it('should solve a math problem', async () => {
        const problem =
            'A taxi driver earns $9461 per 1-hour work. ' +
            'If he works 12 hours a day and in 1 hour ' +
            'he uses 12-liters petrol with price $134 for 1-liter. ' +
            'How much money does he earn in one day?';
        const response = await doMath(problem);
        expect(response).toBe(9461 * 12 - (12 * 12 * 134));
    })
})
