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
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export async function generateContent(
  plan: string,
  niche: string,
  userId: string
): Promise<{ success: boolean; error?: string; limitReached?: boolean }> {
  if (!userId) {
    return { success: false, error: "User is not authenticated." };
  }

  // Free plan usage check
  if (plan === 'free') {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.lastFreeGenerationAt) {
        // Timestamps from server are Firestore Timestamps
        const lastGenDate = (userData.lastFreeGenerationAt as Timestamp).toDate();
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        const nextAvailableDate = new Date(lastGenDate.getTime() + thirtyDaysInMs);
        
        if (new Date() < nextAvailableDate) {
           return { success: false, limitReached: true, error: "You have already used your free generation for this month." };
        }
      }
    }
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

    // Update user's last generation timestamp if they are on the free plan
    if (plan === 'free') {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        lastFreeGenerationAt: serverTimestamp()
      });
    }

    return { success: true };

  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "Failed to generate content. Please try again.";
    return { success: false, error: errorMessage };
  }
}
