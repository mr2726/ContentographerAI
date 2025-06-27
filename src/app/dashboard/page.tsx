'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserContent } from './actions';
import Loading from '@/app/generate/components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ContentDisplay from '@/app/generate/components/ContentDisplay';
import { format } from 'date-fns';
import type { GenerateTiktokVideoScriptOutput } from "@/ai/flows/generate-tiktok-script";
import type { GeneratePostIdeasOutput } from "@/ai/flows/generate-post-ideas";

type GeneratedDataType = (GeneratePostIdeasOutput | GenerateTiktokVideoScriptOutput) & {
  type: "posts" | "script";
};

type ContentItem = GeneratedDataType & {
  id: string;
  createdAt: string;
  niche: string;
  plan: string;
};

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        setLoading(true);
        getUserContent(user.uid)
          .then((data) => {
            setContent(data as ContentItem[]);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Your Dashboard</h1>
        <Button asChild>
          <Link href="/generate">Generate New Content</Link>
        </Button>
      </div>

      {content.length === 0 ? (
        <div className="text-center py-20 bg-card border rounded-lg">
          <h2 className="text-2xl font-headline font-semibold">No content yet!</h2>
          <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
            Click the button above to generate your first set of social media posts.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {content.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  {item.niche} - {item.type === 'posts' ? 'Post Ideas' : 'TikTok Script'}
                </CardTitle>
                <CardDescription>
                  Generated on {format(new Date(item.createdAt), 'MMMM d, yyyy')} using the '{item.plan}' plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentDisplay data={item} plan={item.plan} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


export default function DashboardPage() {
    return (
        <Suspense fallback={<Loading />}>
            <DashboardContent />
        </Suspense>
    )
}
