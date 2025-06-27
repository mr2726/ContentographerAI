'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating TikTok video scripts tailored to a specific niche.
 *
 * - generateTiktokVideoScript - A function that generates a TikTok video script.
 * - GenerateTiktokVideoScriptInput - The input type for the generateTiktokVideoScript function.
 * - GenerateTiktokVideoScriptOutput - The return type for the generateTiktokVideoScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTiktokVideoScriptInputSchema = z.object({
  niche: z
    .string()
    .describe('The specific videography niche (e.g., wedding, food, travel).'),
});
export type GenerateTiktokVideoScriptInput = z.infer<
  typeof GenerateTiktokVideoScriptInputSchema
>;

const GenerateTiktokVideoScriptOutputSchema = z.object({
  videoScript: z.array(
    z.object({
      scene: z
        .string()
        .describe('A description of the video scene, including visuals.'),
      onScreenText: z
        .string()
        .describe('Concise text to display on the screen during the scene.'),
      trendingAudioSuggestion: z
        .string()
        .describe('A suggestion for trending audio to use with the video.'),
    })
  ),
});
export type GenerateTiktokVideoScriptOutput = z.infer<
  typeof GenerateTiktokVideoScriptOutputSchema
>;

export async function generateTiktokVideoScript(
  input: GenerateTiktokVideoScriptInput
): Promise<GenerateTiktokVideoScriptOutput> {
  return generateTiktokVideoScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTiktokVideoScriptPrompt',
  input: {schema: GenerateTiktokVideoScriptInputSchema},
  output: {schema: GenerateTiktokVideoScriptOutputSchema},
  prompt: `You are a creative TikTok video script generator for videographers.

  Based on the videography niche provided, generate a detailed TikTok video script.
  The script should include scene descriptions, concise on-screen text, and trending audio suggestions.
  Each video script should contain at least 5 scenes.

  Niche: {{{niche}}}

  Format the response as a JSON array of scenes, where each scene object contains the following keys:
  - scene (string): A description of the video scene, including visuals.
  - onScreenText (string): Concise text to display on the screen during the scene.
  - trendingAudioSuggestion (string): A suggestion for trending audio to use with the video.
  `,
});

const generateTiktokVideoScriptFlow = ai.defineFlow(
  {
    name: 'generateTiktokVideoScriptFlow',
    inputSchema: GenerateTiktokVideoScriptInputSchema,
    outputSchema: GenerateTiktokVideoScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
