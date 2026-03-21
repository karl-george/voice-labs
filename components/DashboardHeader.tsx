'use client';

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Headphones, ThumbsUpIcon } from 'lucide-react';

const DashboardHeader = () => {
  const { isLoaded, user } = useUser();

  return (
    <div className="flex items-start justify-between">
      {/* Name and welcome message */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Nice to see you</p>
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">
          {isLoaded ? (user?.fullName ?? user?.firstName ?? 'there') : '...'}
        </h1>
      </div>

      {/* Feedback and help buttons */}
      <div className="lg:flex items-center gap-3 hidden">
        <Button variant="outline" size="sm" asChild>
          <Link href="mailto:test@test.com">
            <ThumbsUpIcon />
            <span className="hidden lg:block">Feedback</span>
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="mailto:test@test.com">
            <Headphones />
            <span className="hidden lg:block">Need help?</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
export default DashboardHeader;
