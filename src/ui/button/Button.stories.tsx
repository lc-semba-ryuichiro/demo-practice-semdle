import { Button } from './Button';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['primary', 'outline', 'ghost'],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'inline-radio' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Get started',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline button',
    variant: 'outline',
  },
};

export const Large: Story = {
  args: {
    children: 'Large button',
    size: 'lg',
  },
};
