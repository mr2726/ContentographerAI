"use server";

import {
  generateTiktokVideoScript,
  GenerateTiktokVideoScriptOutput,
} from "@/ai/flows/generate-tiktok-script";
import {
  generatePostIdeas,
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
      let postCount = 7;
      if (plan === "pro") {
        postCount = 30;
      } else if (plan === "ultimate") {
        postCount = 30;
      }
      const result = await generatePostIdeas({ niche, postCount });
      return { data: { ...result, type: "posts" } };
    }
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate content. Please try again." };
  }
}
