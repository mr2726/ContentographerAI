import type { GeneratePostIdeasOutput } from "@/ai/flows/generate-post-ideas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Hash, MessageSquareText } from "lucide-react";

type PostCardsProps = {
  data: GeneratePostIdeasOutput;
};

export default function PostCards({ data }: PostCardsProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.posts.map((post, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline text-xl">
              <Camera className="w-6 h-6 text-primary" />
              Image Concept
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <p className="text-muted-foreground">{post.imageConcept}</p>
            <div>
              <h3 className="flex items-center gap-3 font-headline text-lg mb-2">
                <MessageSquareText className="w-5 h-5 text-primary" />
                Caption
              </h3>
              <p className="text-sm">{post.caption}</p>
            </div>
             <div>
              <h3 className="flex items-center gap-3 font-headline text-lg mb-2">
                <Hash className="w-5 h-5 text-primary" />
                Hashtags
              </h3>
              <p className="text-sm text-accent">{post.hashtags}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
