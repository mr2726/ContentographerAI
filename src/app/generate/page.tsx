"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NicheSelector from "./components/NicheSelector";
import { generateContent } from "./actions";
import { useToast } from "@/hooks/use-toast";
import Loading from "./components/Loading";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, serverTimestamp, deleteField } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { GenerateTiktokVideoScriptOutput } from "@/ai/flows/generate-tiktok-script";
import type { GeneratePostIdeasOutput } from "@/ai/flows/generate-post-ideas";

export type GeneratedDataType =
  | (GeneratePostIdeasOutput & { type: "posts" })
  | (GenerateTiktokVideoScriptOutput & { type: "script" });


function GeneratePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan");

  const { user, userData, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        let redirectPath = '/login';
        const search = searchParams.toString();
        if (search) {
          redirectPath += `?redirect=${encodeURIComponent(`/generate?${search}`)}`;
        } else {
          redirectPath += `?redirect=${encodeURIComponent('/generate')}`;
        }
        router.push(redirectPath);
      } else {
        const planToSet = planFromUrl || userData?.plan || 'free';
        setCurrentPlan(planToSet);

        if (planFromUrl && planFromUrl !== userData?.plan) {
          const userDocRef = doc(db, 'users', user.uid);
          const dataToSet: { plan: string; planSubscribedAt?: any } = {
            plan: planFromUrl,
          };

          if (planFromUrl === "pro" || planFromUrl === "ultimate") {
            dataToSet.planSubscribedAt = serverTimestamp();
          } else {
            dataToSet.planSubscribedAt = deleteField();
          }
          
          setDoc(userDocRef, dataToSet, { merge: true })
            .catch(e => console.error("Failed to update plan", e));
        }
      }
    }
  }, [user, userData, authLoading, router, planFromUrl, searchParams]);

  const handleNicheSelect = async (selectedNiche: string) => {
    if (!currentPlan || !user) return;
    setLoading(true);

    try {
      const result = await generateContent(currentPlan, selectedNiche, user.uid);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: "Content Generated!",
        description: "Redirecting you to your dashboard.",
      });
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error Generating Content",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (authLoading || loading || !currentPlan) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <NicheSelector onNicheSelect={handleNicheSelect} />
    </div>
  );
}

export default function GeneratePage() {
    return (
        <Suspense fallback={<Loading />}>
            <GeneratePageContent />
        </Suspense>
    )
}
