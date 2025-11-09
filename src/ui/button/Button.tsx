'use client';

import { buttonVariants } from './button-variants';
import { cn } from '@/lib/shared/cn';
import type { VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
