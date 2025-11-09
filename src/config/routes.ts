export const ROUTES = {
  marketing: {
    root: '/',
  },
  app: {
    root: '/app',
    dashboard: '/app/dashboard',
  },
  api: {
    health: '/api/health',
  },
  auth: {
    callback: '/auth/callback',
  },
} as const;

export type AppRoute = typeof ROUTES;
