import { render } from 'safetest/react';
import { setOptions } from 'safetest';
import { makeVitest } from 'safetest/vitest';

const { describe, it, expect } = await makeVitest(() => ({
  vitest: import('vitest'),
  __filename,
}));

setOptions({ url: 'http://localhost:3000/' });

describe('Main', () => {
  it('loads a simple div', async () => {
    const { page } = await render(() => <>Testing123</>);
    expect(await page.screenshot()).toMatchImageSnapshot();
  });

  it('Has a landing page', async () => {
    const { page } = await render((app) => <>{app}</>);
    expect(page).toBeTruthy();
  });
});