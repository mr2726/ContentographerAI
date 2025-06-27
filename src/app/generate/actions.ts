"use server";

import {
  generateTiktokVideoScript,
  GenerateTiktokVideoScriptOutput,
} from "@/ai/flows/generate-tiktok-script";
import {
  generatePostIdeas,
  GeneratePostIdeasOutput,
} from "@/ai/flows/generate-post-ideas";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function generateContent(
  plan: string,
  niche: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (!userId) {
    return { success: false, error: "User is not authenticated." };
  }

  try {
    let result: (GeneratePostIdeasOutput | GenerateTiktokVideoScriptOutput) & { type: 'posts' | 'script' };
    
    if (niche === "Videographer") {
      const scriptData = await generateTiktokVideoScript({ niche });
      result = { ...scriptData, type: "script" };
    } else {
      let postCount = 7;
      if (plan === "pro") {
        postCount = 30;
      } else if (plan === "ultimate") {
        postCount = 30;
      }
      const postData = await generatePostIdeas({ niche, postCount });
      result = { ...postData, type: "posts" };
    }
    
    await addDoc(collection(db, 'content'), {
      userId,
      plan,
      niche,
      createdAt: serverTimestamp(),
      ...result
    });

    return { success: true };

  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "Failed to generate content. Please try again.";
    return { success: false, error: errorMessage };
  }
}
