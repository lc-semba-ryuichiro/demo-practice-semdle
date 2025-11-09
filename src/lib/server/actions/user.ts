'use server';

import { ROUTES } from '@/config/routes';
import { revalidatePath } from 'next/cache';

export async function refreshUserDashboard() {
  await Promise.resolve();
  revalidatePath(ROUTES.app.dashboard);
}
