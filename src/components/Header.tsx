import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground">
            Contentographer AI
          </span>
        </Link>
      </div>
    </header>
  );
}
