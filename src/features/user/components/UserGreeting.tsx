import { getUserProfile } from '../lib/profile';

export async function UserGreeting() {
  const profile = await getUserProfile();
  return (
    <div className="rounded-2xl border border-border bg-card/50 p-6">
      <p className="text-sm text-muted-foreground">Welcome back</p>
      <h2 className="text-3xl font-semibold">{profile.displayName}</h2>
      <p className="text-muted-foreground">{profile.email}</p>
    </div>
  );
}
