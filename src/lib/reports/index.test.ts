import { describe, expect, it, jest } from '@jest/globals';
import * as coverage from './coverage/index.ts';
import * as reports from './index.ts';
import print from './print.ts';
import * as usage from './usage/index.ts';

jest.mock('../packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

describe('reports', () => {
  it('coverage', () => {
    expect(reports.coverage).toStrictEqual(coverage);
  });

  it('print', () => {
    expect(reports.print).toStrictEqual(print);
  });

  it('usage', () => {
    expect(reports.usage).toStrictEqual(usage);
  });
});
