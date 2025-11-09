import { ROUTES } from '@/config/routes';
import { buttonVariants } from '@/ui/button/button-variants';
import Link from 'next/link';

export function AuthHero() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/30 p-6">
      <div>
        <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          未来のプロダクトを今すぐ試す
        </p>
        <h2 className="text-2xl font-semibold">Semdle Platform</h2>
        <p className="text-muted-foreground">
          1 つのワークスペースでサインイン、ダッシュボード、Webhook をまとめて体験できます。
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link className={buttonVariants({ size: 'lg' })} href={ROUTES.app.root}>
          アプリに移動
        </Link>
        <Link
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
          href={ROUTES.auth.callback}
        >
          認証コールバックを確認
        </Link>
      </div>
    </div>
  );
}
