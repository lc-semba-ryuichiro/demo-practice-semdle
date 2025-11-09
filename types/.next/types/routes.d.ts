// This file mirrors Next.js typed routes output so tsc can run pre-build.

type AppRoutes = '/';
type PageRoutes = '/app' | '/app/dashboard';
type LayoutRoutes = '/' | '/app';
type RedirectRoutes = never;
type RewriteRoutes = never;
type Routes = AppRoutes | PageRoutes | LayoutRoutes | RedirectRoutes | RewriteRoutes;

interface ParamMap {
  '/': {};
  '/app': {};
  '/app/dashboard': {};
}

export type ParamsOf<Route extends Routes> = ParamMap[Route];

interface LayoutSlotMap {
  '/': never;
  '/app': never;
}

export type { AppRoutes, PageRoutes, LayoutRoutes, RedirectRoutes, RewriteRoutes, ParamMap };

declare global {
  interface PageProps<AppRoute extends AppRoutes> {
    params: Promise<ParamMap[AppRoute]>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  }

  type LayoutProps<LayoutRoute extends LayoutRoutes> = {
    params: Promise<ParamMap[LayoutRoute]>;
    children: React.ReactNode;
  } & {
    [K in LayoutSlotMap[LayoutRoute]]: React.ReactNode;
  };
}
