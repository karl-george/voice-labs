import type { Metadata } from 'next';
import { Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ClerkProvider } from '@clerk/nextjs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TRPCReactProvider } from '@/trpc/client';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Voice Labs',
    template: '%s | Voice Labs',
  },
  description: 'AI-powered text-to-speech and voice cloning platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <TooltipProvider>
          <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
              {children}
              <Toaster />
            </body>
          </html>
        </TooltipProvider>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
