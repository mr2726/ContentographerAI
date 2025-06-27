'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getContentById } from '../actions';
import Loading from '@/app/generate/components/Loading';
import ContentDisplay from '@/app/generate/components/ContentDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { GenerateTiktokVideoScriptOutput } from "@/ai/flows/generate-tiktok-script";
import type { GeneratePostIdeasOutput } from "@/ai/flows/generate-post-ideas";

type GeneratedDataType =
  | (GeneratePostIdeasOutput & { type: "posts" })
  | (GenerateTiktokVideoScriptOutput & { type: "script" });

type ContentItem = GeneratedDataType & {
  id: string;
  createdAt: string;
  niche: string;
  plan: string;
};

function ContentDetailPageContent() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const contentId = params.contentId as string;
    const [content, setContent] = useState<ContentItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (contentId) {
                setLoading(true);
                getContentById(contentId, user.uid)
                    .then((data) => {
                        if (data) {
                            setContent(data as ContentItem);
                        } else {
                            setError("Content not found or you don't have permission to view it.");
                        }
                    })
                    .catch(() => {
                        setError("Failed to load content.");
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        }
    }, [user, authLoading, router, contentId]);

    if (authLoading || loading) {
        return <Loading />;
    }
    
    if (error) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <h1 className="text-2xl font-bold text-destructive">{error}</h1>
                <Button asChild variant="link" className="mt-4">
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        )
    }

    if (!content) {
         return (
            <div className="container mx-auto py-12 px-4 text-center">
                <h1 className="text-2xl font-bold">Content not found.</h1>
                 <Button asChild variant="link" className="mt-4">
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="mb-8">
                <Button asChild variant="outline">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <ArrowLeft />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
            <ContentDisplay data={content} plan={content.plan} />
        </div>
    );
}

export default function ContentDetailPage() {
    return (
        <Suspense fallback={<Loading />}>
            <ContentDetailPageContent />
        </Suspense>
    );
}
