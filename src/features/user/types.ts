export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
}

export interface MetricCard {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'flat';
}
