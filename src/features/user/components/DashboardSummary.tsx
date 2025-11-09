import { getDashboardMetrics } from '../lib/profile';

export async function DashboardSummary() {
  const cards = await getDashboardMetrics();
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article key={card.label} className="rounded-xl border border-border bg-card/30 p-4">
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="text-2xl font-semibold">{card.value}</p>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Trend: {card.trend}
          </p>
        </article>
      ))}
    </div>
  );
}
