'use server';

/**
 * @fileOverview This file contains the Genkit flow for providing AI-powered suggestions on how to improve microgrid efficiency based on historical data.
 *
 * - getEfficiencySuggestions - A function that takes microgrid data as input and returns suggestions for improving efficiency.
 * - EfficiencyAnalysisInput - The input type for the getEfficiencySuggestions function.
 * - EfficiencyAnalysisOutput - The return type for the getEfficiencySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EfficiencyAnalysisInputSchema = z.object({
  historicalData: z.string().describe('Historical microgrid data in JSON format.'),
});
export type EfficiencyAnalysisInput = z.infer<typeof EfficiencyAnalysisInputSchema>;

const EfficiencyAnalysisOutputSchema = z.object({
  suggestions: z.string().describe('AI-powered suggestions on how to improve microgrid efficiency.'),
});
export type EfficiencyAnalysisOutput = z.infer<typeof EfficiencyAnalysisOutputSchema>;

export async function getEfficiencySuggestions(input: EfficiencyAnalysisInput): Promise<EfficiencyAnalysisOutput> {
  return efficiencyAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'efficiencyAnalysisPrompt',
  input: {schema: EfficiencyAnalysisInputSchema},
  output: {schema: EfficiencyAnalysisOutputSchema},
  prompt: `You are an expert in microgrid energy efficiency.

  Based on the historical microgrid data provided, analyze the data and provide actionable suggestions on how to improve the microgrid's efficiency. 

  Historical Data: {{{historicalData}}} `,
});

const efficiencyAnalysisFlow = ai.defineFlow(
  {
    name: 'efficiencyAnalysisFlow',
    inputSchema: EfficiencyAnalysisInputSchema,
    outputSchema: EfficiencyAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
