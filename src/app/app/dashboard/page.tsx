import { AuthGate } from '@/features/auth';
import { DashboardSummary } from '@/features/user';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Team health</h2>
      <Suspense fallback={<p className="text-muted-foreground">Loading metrics…</p>}>
        <AuthGate fallback={<p>Please sign in to inspect dashboard data.</p>}>
          <DashboardSummary />
        </AuthGate>
      </Suspense>
    </section>
  );
}
