import './globals.css';
import { APP_NAME } from '@/config/constants';
import { envClient } from '@/config/env.client';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(envClient.NEXT_PUBLIC_SITE_URL),
  title: `${APP_NAME} | Feature-sliced Next.js playground`,
  description:
    'Next.js App Router playground that demonstrates FSD layering for marketing/app experiences.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground`}
      >
        <div className="flex min-h-screen flex-col gap-8">{children}</div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
