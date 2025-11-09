'use server';

import { ROUTES } from '@/config/routes';
import { revalidatePath } from 'next/cache';

export async function signOutAction() {
  await Promise.resolve();
  revalidatePath(ROUTES.app.root);
  return { success: true };
}
