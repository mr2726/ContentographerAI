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
import { Camera, Hash, MessageSquareText } from "lucide-react";
import { startOfMonth, getDay, format, getDaysInMonth, getDate } from 'date-fns';

type Post = GeneratePostIdeasOutput['posts'][0];

type CalendarDisplayProps = {
  data: GeneratePostIdeasOutput;
};

export default function CalendarDisplay({ data }: CalendarDisplayProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const startingDayOfWeek = getDay(firstDayOfMonth);
  const daysInMonth = getDaysInMonth(today);
  const todayDate = getDate(today);

  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  const emptyCells = Array.from({ length: startingDayOfWeek }, (_, i) => <div key={`empty-${i}`} className="border rounded-lg bg-card/60 min-h-[220px]"></div>);

  const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNumber = i + 1;
    
    if (dayNumber < todayDate) {
      return (
        <Card key={`day-${dayNumber}`} className="h-full flex flex-col min-h-[220px] bg-card/60 text-muted-foreground/50">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-base font-bold text-right">{dayNumber}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 flex-grow"></CardContent>
        </Card>
      );
    }
    
    const postIndex = dayNumber - todayDate;
    const post = data.posts[postIndex];

    if (post) {
      return (
        <Card 
          key={`day-${dayNumber}`} 
          className="h-full flex flex-col min-h-[220px] cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-200"
          onClick={() => setSelectedPost(post)}
        >
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-base font-bold text-right">{dayNumber}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 flex-grow space-y-2 overflow-hidden">
             <div>
                <h3 className="font-headline text-xs flex items-center gap-1.5 mb-1"><Camera className="w-3.5 h-3.5 text-primary"/> Изображение</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{post.imageConcept}</p>
             </div>
             
             <div>
                <h3 className="font-headline text-xs flex items-center gap-1.5 mb-1"><MessageSquareText className="w-3.5 h-3.5 text-primary"/> Текст</h3>
                <p className="text-xs text-muted-foreground line-clamp-3">{post.caption}</p>
             </div>

             <div>
                <h3 className="font-headline text-xs flex items-center gap-1.5 mb-1"><Hash className="w-3.5 h-3.5 text-primary"/> Хештеги</h3>
                <p className="text-xs text-accent break-words line-clamp-2">{post.hashtags}</p>
             </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={`day-${dayNumber}`} className="h-full flex flex-col min-h-[220px]">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-base font-bold text-right">{dayNumber}</CardTitle>
        </CardHeader>
         <CardContent className="p-3 pt-0 flex-grow"></CardContent>
      </Card>
    );
  });

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-headline font-semibold">{format(today, 'MMMM yyyy')}</h2>
          <p className="text-muted-foreground">Ваш подробный контент-план на месяц. Нажмите на пост, чтобы увидеть детали.</p>
        </div>
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

      <Dialog open={!!selectedPost} onOpenChange={(isOpen) => { if (!isOpen) setSelectedPost(null) }}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Детали поста</DialogTitle>
                <DialogDescription>
                  Полное содержимое вашего поста.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="space-y-2">
                  <h3 className="flex items-center gap-3 font-headline text-lg mb-2">
                    <Camera className="w-5 h-5 text-primary" />
                    Идея для изображения
                  </h3>
                  <p className="text-muted-foreground">{selectedPost.imageConcept}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="flex items-center gap-3 font-headline text-lg mb-2">
                    <MessageSquareText className="w-5 h-5 text-primary" />
                    Текст поста
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedPost.caption}</p>
                </div>
                 <div className="space-y-2">
                  <h3 className="flex items-center gap-3 font-headline text-lg mb-2">
                    <Hash className="w-5 h-5 text-primary" />
                    Хештеги
                  </h3>
                  <p className="text-sm text-accent break-words">{selectedPost.hashtags}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
