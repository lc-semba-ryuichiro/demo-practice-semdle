import type { MetricCard, UserProfile } from '../types';

export function getUserProfile(): Promise<UserProfile> {
  return Promise.resolve({
    id: 'demo-user',
    displayName: 'Demo User',
    email: 'demo@example.com',
  });
}

export function getDashboardMetrics(): Promise<MetricCard[]> {
  return Promise.resolve([
    { label: 'Active members', value: '128', trend: 'up' },
    { label: 'DAU', value: '64', trend: 'flat' },
    { label: 'Latency', value: '112ms', trend: 'down' },
  ]);
}
