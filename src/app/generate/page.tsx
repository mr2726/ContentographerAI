"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NicheSelector from "./components/NicheSelector";
import { generateContent } from "./actions";
import { useToast } from "@/hooks/use-toast";
import Loading from "./components/Loading";
import ContentDisplay from "./components/ContentDisplay";
import type { GenerateTiktokVideoScriptOutput } from "@/ai/flows/generate-tiktok-script";
import type { GeneratePostIdeasOutput } from "@/ai/flows/generate-post-ideas";
import { Button } from "@/components/ui/button";

export type GeneratedDataType = (GeneratePostIdeasOutput | GenerateTiktokVideoScriptOutput) & {
  type: "posts" | "script";
};

function GeneratePageContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "free";

  const [niche, setNiche] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedDataType | null>(null);
  const { toast } = useToast();

  const handleNicheSelect = async (selectedNiche: string) => {
    setNiche(selectedNiche);
    setLoading(true);
    setGeneratedData(null);
    try {
      const result = await generateContent(plan, selectedNiche);
      if (result.error) {
        throw new Error(result.error);
      }
      setGeneratedData(result.data as GeneratedDataType);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error Generating Content",
        description: errorMessage,
        variant: "destructive",
      });
      setNiche(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNiche(null);
    setGeneratedData(null);
    setLoading(false);
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {!niche && <NicheSelector onNicheSelect={handleNicheSelect} />}

      {loading && <Loading />}
      
      {generatedData && (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-headline">Your Content is Ready!</h1>
            <p className="text-muted-foreground mt-2">Here are the ideas generated for the <span className="font-bold text-primary">{niche}</span> niche.</p>
            <Button onClick={handleReset} variant="outline" className="mt-4">Start Over</Button>
          </div>
          <ContentDisplay data={generatedData} plan={plan} />
        </div>
      )}
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
