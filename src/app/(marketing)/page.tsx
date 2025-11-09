import { ROUTES } from '@/config/routes';
import { AuthHero } from '@/features/auth';
import { buttonVariants } from '@/ui/button/button-variants';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HIGHLIGHTS = [
  {
    title: 'Modular FSD',
    description: 'Features、UI、Libs を機能単位で整理し、保守性と可搬性を高めます。',
  },
  {
    title: 'Supabase ready',
    description: 'Server/Client/Admin クライアントを分割し、RLS 前提の開発がすぐに始められます。',
  },
  {
    title: 'DX tooling',
    description: 'Vitest、Playwright、MSW を同居させた統合テスト基盤。',
  },
];

export default function MarketingHomePage() {
  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="space-y-6">
        <p className="text-sm tracking-[0.3em] text-muted-foreground uppercase">Semdle</p>
        <h1 className="text-4xl leading-tight font-semibold sm:text-5xl">
          現代的な Feature-Sliced Design を Next.js App Router で即座に試す
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          src/app をコンテキストごとに分割し、features / ui / lib / config
          で責務を明示した実験用リポジトリです。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className={buttonVariants({ size: 'lg' })} href={ROUTES.app.root}>
            アプリケーションに進む
          </Link>
          <Link
            className={buttonVariants({ variant: 'ghost', size: 'lg' })}
            href={ROUTES.app.dashboard}
          >
            ダッシュボードを見る
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {HIGHLIGHTS.map((highlight) => (
          <article
            key={highlight.title}
            className="rounded-2xl border border-border bg-card/30 p-4"
          >
            <h3 className="text-xl font-semibold">{highlight.title}</h3>
            <p className="text-sm text-muted-foreground">{highlight.description}</p>
          </article>
        ))}
      </section>

      <AuthHero />
    </div>
  );
}
