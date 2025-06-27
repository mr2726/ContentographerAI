'use server';

/**
 * @fileOverview A flow to generate a week's worth of Instagram post ideas tailored to a photographer's niche.
 *
 * - generateWeeklyPostIdeas - A function that generates weekly post ideas.
 * - GeneratePostIdeasInput - The input type for the generateWeeklyPostIdeas function.
 * - GeneratePostIdeasOutput - The return type for the generateWeeklyPostIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostIdeasInputSchema = z.object({
  niche: z
    .string()
    .describe("The photographer's niche (e.g., food, lifestyle, wedding)."),
});
export type GeneratePostIdeasInput = z.infer<typeof GeneratePostIdeasInputSchema>;

const GeneratePostIdeasOutputSchema = z.object({
  posts: z.array(
    z.object({
      imageConcept: z.string().describe('The concept for the image or video.'),
      caption: z.string().describe('An engaging caption for the post.'),
      hashtags: z.string().describe('Relevant hashtags for the post.'),
    })
  ).describe('An array of Instagram post ideas for the week.'),
});
export type GeneratePostIdeasOutput = z.infer<typeof GeneratePostIdeasOutputSchema>;

export async function generateWeeklyPostIdeas(
  input: GeneratePostIdeasInput
): Promise<GeneratePostIdeasOutput> {
  return generatePostIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePostIdeasPrompt',
  input: {schema: GeneratePostIdeasInputSchema},
  output: {schema: GeneratePostIdeasOutputSchema},
  prompt: `You are an AI assistant specializing in generating Instagram post ideas for photographers.

  Generate a week's worth of Instagram post ideas tailored to the photographer's niche.
  Each post idea should include an image concept, an engaging caption, and relevant hashtags.

  Photographer's Niche: {{{niche}}}

  The output should be a JSON object with a 'posts' array. Each object in the array should include:
  - imageConcept: The concept for the image or video.
  - caption: An engaging caption for the post.
  - hashtags: Relevant hashtags for the post.
  `,
});

const generatePostIdeasFlow = ai.defineFlow(
  {
    name: 'generatePostIdeasFlow',
    inputSchema: GeneratePostIdeasInputSchema,
    outputSchema: GeneratePostIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
