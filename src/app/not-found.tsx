import { ROUTES } from '@/config/routes';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm tracking-wide text-muted-foreground uppercase">404</p>
      <h1 className="text-3xl font-semibold">ページが見つかりませんでした</h1>
      <p className="text-muted-foreground">
        URL を確認するか、マーケティングページに戻ってください。
      </p>
      <Link
        className="text-primary underline-offset-4 hover:underline"
        href={ROUTES.marketing.root}
      >
        トップへ戻る
      </Link>
    </div>
  );
}
