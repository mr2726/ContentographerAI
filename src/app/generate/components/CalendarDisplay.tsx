import type { GeneratePostIdeasOutput } from "@/ai/flows/generate-post-ideas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Clock, Film, GalleryHorizontal } from "lucide-react";

type CalendarDisplayProps = {
  data: GeneratePostIdeasOutput;
};

const MOCK_DATA = [
    { time: '9:00 AM', format: 'Post', icon: Camera },
    { time: '1:00 PM', format: 'Reels', icon: Film },
    { time: '6:00 PM', format: 'Carousel', icon: GalleryHorizontal },
    { time: '11:00 AM', format: 'Post', icon: Camera },
    { time: '4:00 PM', format: 'Reels', icon: Film },
    { time: '8:00 PM', format: 'Carousel', icon: GalleryHorizontal },
    { time: '10:00 AM', format: 'Post', icon: Camera },
]

export default function CalendarDisplay({ data }: CalendarDisplayProps) {
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date.toLocaleString('en-US', { weekday: 'long' });
  });

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-1">
        {weekDays.map((day, dayIndex) => (
          <div key={day} className="bg-muted/50 p-2 text-center font-headline font-semibold rounded-t-lg">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-start">
        {data.posts.slice(0, 7).map((post, index) => {
          const mock = MOCK_DATA[index % MOCK_DATA.length];
          const date = new Date(today);
          date.setDate(today.getDate() + index);

          return (
            <Card key={index} className="h-full flex flex-col border-t-4 border-primary">
              <CardHeader className="pb-2">
                <CardDescription>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</CardDescription>
                <div className="flex justify-between items-center pt-2">
                    <Badge variant="secondary" className="flex items-center gap-1.5">
                        <mock.icon className="w-3.5 h-3.5" />
                        {mock.format}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5"/>
                        {mock.time}
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm font-semibold">{post.imageConcept}</p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{post.caption}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
