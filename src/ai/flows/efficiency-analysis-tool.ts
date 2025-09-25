'use server';

/**
 * @fileOverview This file contains the Genkit flow for analyzing efficiency data and providing suggestions for optimizing microgrid performance.
 *
 * - analyzeEfficiency - A function that takes microgrid data as input and returns suggestions for improving efficiency.
 * - EfficiencyAnalysisInput - The input type for the analyzeEfficiency function.
 * - EfficiencyAnalysisOutput - The return type for the analyzeEfficiency function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EfficiencyAnalysisInputSchema = z.object({
  timestamp: z.string().describe('Timestamp of the data record.'),
  output_current: z.number().describe('Output current of the microgrid.'),
  output_voltage: z.number().describe('Output voltage of the microgrid.'),
  input_current: z.number().describe('Input current from the battery.'),
  input_voltage: z.number().describe('Input voltage from the battery.'),
  battery_soc: z.number().describe('Battery state of charge (%).'),
  charging_source: z.string().describe('Source of charging (e.g., USB, solar).'),
  battery_charge: z.number().describe('Current battery charge (mAh).'),
  efficiency: z.number().describe('Efficiency of the microgrid (%).'),
}).describe('Microgrid data record.');

export type EfficiencyAnalysisInput = z.infer<typeof EfficiencyAnalysisInputSchema>;

const EfficiencyAnalysisOutputSchema = z.object({
  suggestions: z.string().describe('AI-powered suggestions for optimizing microgrid performance.'),
}).describe('Suggestions for optimizing microgrid performance.');

export type EfficiencyAnalysisOutput = z.infer<typeof EfficiencyAnalysisOutputSchema>;

export async function analyzeEfficiency(input: EfficiencyAnalysisInput): Promise<EfficiencyAnalysisOutput> {
  return analyzeEfficiencyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'efficiencyAnalysisPrompt',
  input: {schema: EfficiencyAnalysisInputSchema},
  output: {schema: EfficiencyAnalysisOutputSchema},
  prompt: `You are an expert in microgrid energy efficiency.

Analyze the provided microgrid data and provide actionable suggestions on how to improve the microgrid's performance and efficiency. Consider factors such as voltage, current, battery state of charge, charging source, and overall efficiency.

Microgrid Data: {{{input}}} `,
});

const analyzeEfficiencyFlow = ai.defineFlow(
  {
    name: 'analyzeEfficiencyFlow',
    inputSchema: EfficiencyAnalysisInputSchema,
    outputSchema: EfficiencyAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
