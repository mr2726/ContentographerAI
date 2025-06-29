"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NicheSelector from "./components/NicheSelector";
import { generateContent } from "./actions";
import { useToast } from "@/hooks/use-toast";
import Loading from "./components/Loading";
import { useAuth } from "@/context/AuthContext";
import { doc, serverTimestamp, deleteField, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { GenerateTiktokVideoScriptOutput } from "@/ai/flows/generate-tiktok-script";
import type { GeneratePostIdeasOutput } from "@/ai/flows/generate-post-ideas";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type GeneratedDataType =
  | (GeneratePostIdeasOutput & { type: "posts" })
  | (GenerateTiktokVideoScriptOutput & { type: "script" });


function GeneratePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan");

  const { user, userData, loading: authLoading } = useAuth();
  
  // Set initial loading state to true if we are potentially updating a plan from the URL
  const [loading, setLoading] = useState(!!planFromUrl);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      let redirectPath = '/login';
      const search = searchParams.toString();
      if (search) {
        redirectPath += `?redirect=${encodeURIComponent(`/generate?${search}`)}`;
      } else {
        redirectPath += `?redirect=${encodeURIComponent('/generate')}`;
      }
      router.push(redirectPath);
      return;
    }
    
    // Handle plan update from LemonSqueezy redirect
    if (planFromUrl && planFromUrl !== userData?.plan) {
      const userDocRef = doc(db, 'users', user.uid);
      const dataToSet: { plan: string; planSubscribedAt?: any, lastFreeGenerationAt?: any } = {
        plan: planFromUrl,
      };

      if (planFromUrl === "pro" || planFromUrl === "ultimate") {
        dataToSet.planSubscribedAt = serverTimestamp();
        dataToSet.lastFreeGenerationAt = deleteField();
      } else {
        dataToSet.planSubscribedAt = deleteField();
      }
      
      updateDoc(userDocRef, dataToSet)
        .then(() => {
          toast({
            title: "Plan Updated Successfully!",
            description: `You are now on the ${planFromUrl} plan.`,
          });
          // Redirect to dashboard, removing the query params
          router.push('/dashboard');
        })
        .catch(e => {
          console.error("Failed to update plan", e);
          toast({
            title: "Error Updating Plan",
            description: "There was an issue updating your plan. Please contact support.",
            variant: "destructive",
          });
          // On error, stop loading and show the normal page by redirecting without params
          router.push('/generate');
        });
    } else {
      // No plan update needed, proceed to show the page
      const planToSet = userData?.plan || 'free';
      setCurrentPlan(planToSet);
      setLoading(false);
    }

  }, [user, userData, authLoading, router, planFromUrl, searchParams, toast]);

  const handleNicheSelect = async (selectedNiche: string) => {
    if (!currentPlan || !user) return;
    setLoading(true);

    try {
      const result = await generateContent(currentPlan, selectedNiche, user.uid);
      if (result.limitReached) {
        setShowLimitDialog(true);
        setLoading(false);
        return;
      }
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
      <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Free Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              You've used your one free generation for the month. To continue creating, please upgrade to a Pro or Ultimate plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/pricing')}>
              View Pricing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
