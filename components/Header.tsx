import { cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Headphones, ThumbsUpIcon } from 'lucide-react';

const Header = ({ title, className }: { title: string; className?: string }) => {
  return (
    <div className={cn('flex items-center justify-between border-b px-4 py-4', className)}>
      {/* Trigger and title */}
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>

      {/* Feedback and help buttons */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="mailto:test@test.com" aria-label="Feedback">
            <ThumbsUpIcon aria-hidden="true" />
            <span className="hidden lg:block">Feedback</span>
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="mailto:test@test.com" aria-label="Need help?">
            <Headphones aria-hidden="true" />
            <span className="hidden lg:block">Need help?</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
export default Header;
