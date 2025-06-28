'use client';

import Link from 'next/link';
import { Sparkles, Gem } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, userData } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (user) {
      localStorage.removeItem(`userContent_${user.uid}`);
    }
    await auth.signOut();
    router.push('/');
  };

  return (
    <header className="py-4 px-4 md:px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground">
            Contentographer AI
          </span>
        </Link>
        <nav>
          {user ? (
            <div className="flex items-center gap-4">
               {userData?.plan && (
                <Badge variant="outline" className="flex items-center gap-1.5 capitalize">
                  <Gem className="w-3.5 h-3.5" />
                  {userData.plan} Plan
                </Badge>
              )}
              <Button asChild variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/pricing">Pricing</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/pricing">Pricing</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
