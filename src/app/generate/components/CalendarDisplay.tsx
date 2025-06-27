"use client";

import { useState } from 'react';
import type { GeneratePostIdeasOutput } from "@/ai/flows/generate-post-ideas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { Camera, Hash, MessageSquareText, Clock } from "lucide-react";
import { 
  startOfMonth, 
  getDay, 
  format, 
  getDaysInMonth, 
  addDays, 
  isBefore, 
  addMonths, 
  startOfToday,
  endOfMonth
} from 'date-fns';

type Post = GeneratePostIdeasOutput['posts'][0];

type CalendarDisplayProps = {
  data: GeneratePostIdeasOutput;
};

export default function CalendarDisplay({ data }: CalendarDisplayProps) {
  const [selectedPost, setSelectedPost] = useState<{ post: Post; date: Date } | null>(null);

  const today = startOfToday();
  const postsMap = new Map<string, Post>();
  data.posts.forEach((post, i) => {
    const postDate = addDays(today, i);
    postsMap.set(format(postDate, 'yyyy-MM-dd'), post);
  });

  const startDate = today;
  const endDate = addDays(today, data.posts.length > 0 ? data.posts.length - 1 : 0);

  const monthsToRender: Date[] = [];
  if (data.posts.length > 0) {
    let currentMonth = startOfMonth(startDate);
    // Ensure the loop includes the end date's month
    while (isBefore(currentMonth, addMonths(endOfMonth(endDate), 1))) {
      monthsToRender.push(currentMonth);
      currentMonth = addMonths(currentMonth, 1);
      if (monthsToRender.length > 12) break; // Safety break
    }
  }
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderMonth = (monthDate: Date) => {
    const firstDayOfMonth = startOfMonth(monthDate);
    const startingDayOfWeek = getDay(firstDayOfMonth);
    const daysInMonth = getDaysInMonth(monthDate);
    
    const emptyCells = Array.from({ length: startingDayOfWeek }, (_, i) => <div key={`empty-${format(monthDate, 'yyyy-MM')}-${i}`} className="border rounded-lg bg-card/60 min-h-[220px]"></div>);

    const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNumber = i + 1;
      const cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), dayNumber);

      if (isBefore(cellDate, today)) {
        return (
          <Card key={`day-${format(cellDate, 'yyyy-MM-dd')}`} className="h-full flex flex-col min-h-[220px] bg-card/60 text-muted-foreground/50">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-base font-bold text-right">{dayNumber}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 flex-grow"></CardContent>
          </Card>
        );
      }
      
      const post = postsMap.get(format(cellDate, 'yyyy-MM-dd'));

      if (post) {
        return (
          <Card 
            key={`day-${format(cellDate, 'yyyy-MM-dd')}`} 
            className="h-full flex flex-col min-h-[220px] cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-200"
            onClick={() => setSelectedPost({ post, date: cellDate })}
          >
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-base font-bold text-right">{dayNumber}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 flex-grow space-y-2 overflow-hidden">
               <div>
                  <h3 className="font-headline text-xs flex items-center gap-1.5 mb-1"><Camera className="w-3.5 h-3.5 text-primary"/> Image</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{post.imageConcept}</p>
               </div>
               
               <div>
                  <h3 className="font-headline text-xs flex items-center gap-1.5 mb-1"><MessageSquareText className="w-3.5 h-3.5 text-primary"/> Caption</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3">{post.caption}</p>
               </div>

               <div>
                  <h3 className="font-headline text-xs flex items-center gap-1.5 mb-1"><Hash className="w-3.5 h-3.5 text-primary"/> Hashtags</h3>
                  <p className="text-xs text-accent break-words line-clamp-2">{post.hashtags}</p>
               </div>
            </CardContent>
          </Card>
        );
      }

      return (
        <Card key={`day-${format(cellDate, 'yyyy-MM-dd')}`} className="h-full flex flex-col min-h-[220px]">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-base font-bold text-right">{dayNumber}</CardTitle>
          </CardHeader>
           <CardContent className="p-3 pt-0 flex-grow"></CardContent>
        </Card>
      );
    });

    return (
      <div key={format(monthDate, 'yyyy-MM')} className="mb-12">
        <h2 className="text-2xl font-headline font-semibold text-center mb-6">{format(monthDate, 'MMMM yyyy')}</h2>
        <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-muted-foreground">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 items-start">
          {emptyCells}
          {dayCells}
        </div>
      </div>
    )
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-headline font-semibold">Your Content Calendar</h2>
          <p className="text-muted-foreground">Your detailed content plan. Click on a post to see details.</p>
        </div>
        {monthsToRender.map(month => renderMonth(month))}
      </div>

      <Dialog open={!!selectedPost} onOpenChange={(isOpen) => { if (!isOpen) setSelectedPost(null) }}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Post Details for {format(selectedPost.date, 'MMMM do')}</DialogTitle>
                <DialogDescription>
                  Full content for your post.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="space-y-2">
                  <h3 className="flex items-center gap-3 font-headline text-lg mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Suggested Post Time
                  </h3>
                  <p className="text-muted-foreground">{selectedPost.post.postTime}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="flex items-center gap-3 font-headline text-lg mb-2">
                    <Camera className="w-5 h-5 text-primary" />
                    Image Idea
                  </h3>
                  <p className="text-muted-foreground">{selectedPost.post.imageConcept}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="flex items-center gap-3 font-headline text-lg mb-2">
                    <MessageSquareText className="w-5 h-5 text-primary" />
                    Post Caption
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedPost.post.caption}</p>
                </div>
                 <div className="space-y-2">
                  <h3 className="flex items-center gap-3 font-headline text-lg mb-2">
                    <Hash className="w-5 h-5 text-primary" />
                    Hashtags
                  </h3>
                  <p className="text-sm text-accent break-words">{selectedPost.post.hashtags}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
