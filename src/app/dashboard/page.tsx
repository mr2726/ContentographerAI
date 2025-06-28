'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserContent } from './actions';
import Loading from '@/app/generate/components/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { FileText, ArrowRight } from 'lucide-react';

type ContentItemSummary = {
  id: string;
  createdAt: string;
  niche: string;
  plan: string;
  type: 'posts' | 'script';
  title?: string;
};

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<ContentItemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }
    
    let hasCachedData = false;
    try {
      const cachedContentJson = localStorage.getItem(`userContent_${user.uid}`);
      if (cachedContentJson) {
        const cachedContent = JSON.parse(cachedContentJson);
        if (Array.isArray(cachedContent)) {
          setContent(cachedContent);
          hasCachedData = true;
        }
      }
    } catch (error) {
      console.error("Failed to parse content from localStorage", error);
      localStorage.removeItem(`userContent_${user.uid}`);
    }

    setLoading(!hasCachedData);

    getUserContent(user.uid)
      .then((data) => {
        const contentData = data as ContentItemSummary[];
        // Sort by creation date descending
        contentData.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        });
        
        setContent(contentData);
        try {
          localStorage.setItem(`userContent_${user.uid}`, JSON.stringify(contentData));
        } catch (error) {
          console.error("Failed to save content to localStorage", error);
        }
      })
      .catch((error) => {
          console.error("Failed to fetch user content:", error);
      })
      .finally(() => {
        setLoading(false);
      });
      
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
        <div className="space-y-4">
          {content.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow group">
               <Link href={`/dashboard/${item.id}`} className="block">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-headline text-xl font-semibold">
                                {item.niche} - {item.type === 'posts' ? 'Post Ideas' : 'TikTok Script'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {item.createdAt ? `Generated on ${format(new Date(item.createdAt), 'MMMM d, yyyy')}`: "Date not available"}
                            </p>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
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
