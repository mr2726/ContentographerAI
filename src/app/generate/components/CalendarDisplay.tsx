import type { GeneratePostIdeasOutput } from "@/ai/flows/generate-post-ideas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Hash, MessageSquareText } from "lucide-react";
import { startOfMonth, getDay, format } from 'date-fns';

type CalendarDisplayProps = {
  data: GeneratePostIdeasOutput;
};

export default function CalendarDisplay({ data }: CalendarDisplayProps) {
  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const startingDayOfWeek = getDay(firstDayOfMonth); // 0 for Sunday

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const emptyCells = Array.from({ length: startingDayOfWeek }, (_, i) => <div key={`empty-${i}`} className="border rounded-lg bg-card min-h-[220px]"></div>);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-headline font-semibold">{format(today, 'MMMM yyyy')}</h2>
        <p className="text-muted-foreground">Your detailed content plan for the month.</p>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-muted-foreground">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 items-start">
        {emptyCells}
        {data.posts.map((post, index) => {
          const dayNumber = index + 1;
          return (
            <Card key={index} className="h-full flex flex-col min-h-[220px]">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-base font-bold text-right">{dayNumber}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 flex-grow space-y-2">
                 <div>
                    <h3 className="font-headline text-xs flex items-center gap-1.5 mb-1"><Camera className="w-3.5 h-3.5 text-primary"/> Image</h3>
                    <p className="text-xs text-muted-foreground">{post.imageConcept}</p>
                 </div>
                 
                 <div>
                    <h3 className="font-headline text-xs flex items-center gap-1.5 mb-1"><MessageSquareText className="w-3.5 h-3.5 text-primary"/> Caption</h3>
                    <p className="text-xs text-muted-foreground line-clamp-3">{post.caption}</p>
                 </div>

                 <div>
                    <h3 className="font-headline text-xs flex items-center gap-1.5 mb-1"><Hash className="w-3.5 h-3.5 text-primary"/> Hashtags</h3>
                    <p className="text-xs text-accent break-words">{post.hashtags}</p>
                 </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
