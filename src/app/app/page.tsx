import { AuthGate, AuthHero } from '@/features/auth';
import { UserGreeting } from '@/features/user';
import { Suspense } from 'react';

export default function AppHomePage() {
  return (
    <section className="space-y-6">
      <Suspense fallback={<p className="text-muted-foreground">Loading account…</p>}>
        <AuthGate fallback={<AuthHero />}>
          <UserGreeting />
        </AuthGate>
      </Suspense>
    </section>
  );
}
