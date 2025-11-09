import { Button } from './Button';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

describe('Button', () => {
  it('renders label', () => {
    const html = renderToString(<Button>Launch</Button>);
    expect(html).toContain('Launch');
  });

  it('applies variant classes', () => {
    const html = renderToString(
      <Button variant="outline" size="lg">
        Outline
      </Button>,
    );
    expect(html).toContain('Outline');
    expect(html).toContain('text-lg');
  });
});
