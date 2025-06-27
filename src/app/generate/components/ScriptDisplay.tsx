import type { GenerateTiktokVideoScriptOutput } from "@/ai/flows/generate-tiktok-script";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clapperboard, Music, Text } from "lucide-react";

type ScriptDisplayProps = {
  data: GenerateTiktokVideoScriptOutput;
};

export default function ScriptDisplay({ data }: ScriptDisplayProps) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Generated TikTok Script</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {data.videoScript.map((scene, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="font-headline text-lg">
                Scene {index + 1}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-1">
                    <Clapperboard className="w-5 h-5 text-primary" />
                    Visuals
                  </h4>
                  <p className="text-muted-foreground pl-7">{scene.scene}</p>
                </div>
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-1">
                    <Text className="w-5 h-5 text-primary" />
                    On-Screen Text
                  </h4>
                  <p className="text-muted-foreground pl-7">"{scene.onScreenText}"</p>
                </div>
                 <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-1">
                    <Music className="w-5 h-5 text-primary" />
                    Audio Suggestion
                  </h4>
                  <p className="text-muted-foreground pl-7">{scene.trendingAudioSuggestion}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
