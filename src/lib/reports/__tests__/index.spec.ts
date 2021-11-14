import * as coverage from '../coverage/index.js';
import * as reports from '../index.js';
import print from '../print.js';
import * as usage from '../usage/index.js';

jest.mock('../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));

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
