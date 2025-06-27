'use server';

/**
 * @fileOverview A flow to generate Instagram post ideas tailored to a photographer's niche.
 *
 * - generatePostIdeas - A function that generates post ideas.
 * - GeneratePostIdeasInput - The input type for the generatePostIdeas function.
 * - GeneratePostIdeasOutput - The return type for the generatePostIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostIdeasInputSchema = z.object({
  niche: z
    .string()
    .describe("The photographer's niche (e.g., food, lifestyle, wedding)."),
  postCount: z.number().describe('The number of post ideas to generate.'),
});
export type GeneratePostIdeasInput = z.infer<typeof GeneratePostIdeasInputSchema>;

const GeneratePostIdeasOutputSchema = z.object({
  posts: z.array(
    z.object({
      imageConcept: z.string().describe('The concept for the image or video.'),
      caption: z.string().describe('An engaging caption for the post.'),
      hashtags: z.string().describe('Relevant hashtags for the post.'),
      postTime: z.string().describe('A suggested time for the post (e.g., "9:00 AM PST").'),
    })
  ).describe('An array of Instagram post ideas.'),
});
export type GeneratePostIdeasOutput = z.infer<typeof GeneratePostIdeasOutputSchema>;

export async function generatePostIdeas(
  input: GeneratePostIdeasInput
): Promise<GeneratePostIdeasOutput> {
  return generatePostIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePostIdeasPrompt',
  input: {schema: GeneratePostIdeasInputSchema},
  output: {schema: GeneratePostIdeasOutputSchema},
  prompt: `You are an AI assistant specializing in generating Instagram post ideas for photographers. Your output must be in English.

  Generate {{{postCount}}} Instagram post ideas tailored to the photographer's niche.
  Each post idea should include an image concept, an engaging caption, relevant hashtags, and a suggested posting time.

  Photographer's Niche: {{{niche}}}

  The output should be a JSON object with a 'posts' array. Each object in the array should include:
  - imageConcept: The concept for the image or video.
  - caption: An engaging caption for the post.
  - hashtags: Relevant hashtags for the post.
  - postTime: A suggested time for the post (e.g., "9:00 AM PST").
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
