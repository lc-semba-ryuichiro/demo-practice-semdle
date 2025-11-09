import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            In-app experience
          </p>
          <h1 className="text-3xl font-semibold">Semdle Control Center</h1>
        </header>
        <main className="flex flex-1 flex-col gap-6">{children}</main>
      </div>
    </div>
  );
}
