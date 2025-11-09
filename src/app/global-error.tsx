'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ja">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
        <div className="text-center">
          <p className="text-sm tracking-wide text-muted-foreground uppercase">Global Error</p>
          <h1 className="text-3xl font-semibold">予期せぬエラーが発生しました</h1>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
        <button
          type="button"
          className="rounded-full bg-foreground px-6 py-2 text-background"
          onClick={() => reset()}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
