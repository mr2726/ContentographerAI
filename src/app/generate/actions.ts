"use server";

import {
  generateTiktokVideoScript,
  GenerateTiktokVideoScriptOutput,
} from "@/ai/flows/generate-tiktok-script";
import {
  generateWeeklyPostIdeas,
  GeneratePostIdeasOutput,
} from "@/ai/flows/generate-post-ideas";

export async function generateContent(
  plan: string,
  niche: string
): Promise<{
  data?: (GeneratePostIdeasOutput | GenerateTiktokVideoScriptOutput) & { type: 'posts' | 'script' };
  error?: string;
}> {
  try {
    if (niche === "Videographer") {
      const result = await generateTiktokVideoScript({ niche });
      return { data: { ...result, type: "script" } };
    } else {
      const result = await generateWeeklyPostIdeas({ niche });
      // In a real app, you would generate more posts for Pro/Ultimate plans.
      // For this example, we generate 7 posts for all plans.
      // The distinction is handled in the UI (e.g., showing the calendar).
      return { data: { ...result, type: "posts" } };
    }
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate content. Please try again." };
  }
}
