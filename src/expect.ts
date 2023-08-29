import { Matchers } from './playwright-types';
import type { BrowserSpy } from './jest';
import { isInNode } from './is-in-node';
import { anythingProxy } from './anythingProxy';

export const makeExpect = <T>(expect: T) => {
  const expectMatchers = [
    'anything',
    'any',
    'not',
    'arrayContaining',
    'closeTo',
    'objectContaining',
    'stringContaining',
    'stringMatching',
  ] as const;
  type ExpectMatchers = typeof expectMatchers[number];
  const _exportedExpect = <T>(
    actual: T
  ): 0 extends 1 & T
    ? Matchers<T>
    : T extends BrowserSpy<any[], any>
    ? 'Browser mocks need to be awaited. Try changing `expect(spy)` to `expect(await spy)`'
    : Matchers<T> => {
    if ((actual as any)?.__isBrowserSpy) {
      console.warn(
        'Browser mocks need to be awaited. Try changing `expect(spy)` to `expect(await spy)`'
      );
      return 'Browser mocks need to be awaited. Try changing `expect(spy)` to `expect(await spy)`' as any;
    }
    return (expect as any)(actual) as any;
  };

  const exportedExpect: typeof _exportedExpect &
    Pick<typeof expect, ExpectMatchers & keyof T> = isInNode
    ? _exportedExpect
    : anythingProxy;

  if (isInNode) {
    for (const matcher of expectMatchers) {
      (exportedExpect as any)[matcher] = (expect as any)[matcher];
    }
  }
  return exportedExpect;
};