'use server';

/**
 * @fileOverview This file contains the Genkit flow for analyzing historical microgrid efficiency data and suggesting improvements using AI.
 *
 * - analyzeEfficiencyAndSuggestImprovements - A function that takes historical efficiency data as input and returns suggestions for improving microgrid performance.
 * - EfficiencyAnalysisInput - The input type for the analyzeEfficiencyAndSuggestImprovements function.
 * - EfficiencyAnalysisOutput - The return type for the analyzeEfficiencyAndSuggestImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EfficiencyAnalysisInputSchema = z.object({
  historicalEfficiencyData: z.string().describe('Historical microgrid efficiency data in JSON format.'),
});
export type EfficiencyAnalysisInput = z.infer<typeof EfficiencyAnalysisInputSchema>;

const EfficiencyAnalysisOutputSchema = z.object({
  suggestions: z.string().describe('AI-powered suggestions on how to improve microgrid performance, such as adjusting charging schedules or optimizing load distribution.'),
});
export type EfficiencyAnalysisOutput = z.infer<typeof EfficiencyAnalysisOutputSchema>;

export async function analyzeEfficiencyAndSuggestImprovements(input: EfficiencyAnalysisInput): Promise<EfficiencyAnalysisOutput> {
  return analyzeEfficiencyAndSuggestImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEfficiencyAndSuggestImprovementsPrompt',
  input: {schema: EfficiencyAnalysisInputSchema},
  output: {schema: EfficiencyAnalysisOutputSchema},
  prompt: `You are an expert in microgrid energy efficiency.

Analyze the historical microgrid efficiency data provided and provide actionable suggestions on how to improve the microgrid's performance. Consider factors such as charging schedules, load distribution, and energy consumption patterns.

Historical Efficiency Data: {{{historicalEfficiencyData}}} `,
});

const analyzeEfficiencyAndSuggestImprovementsFlow = ai.defineFlow(
  {
    name: 'analyzeEfficiencyAndSuggestImprovementsFlow',
    inputSchema: EfficiencyAnalysisInputSchema,
    outputSchema: EfficiencyAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
