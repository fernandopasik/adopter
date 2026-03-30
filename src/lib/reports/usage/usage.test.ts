import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';
import type { PackageUsage } from './package-usage.ts';
import type { UsageSummary } from './summary.ts';

describe('usage', async () => {
  const getPackageNamesMock = mock.fn<() => string[]>(() => []);
  const packageUsageMock = mock.fn();
  const summaryMock = mock.fn<() => UsageSummary>();

  const packagesModule = mock.module('../../packages/index.ts', {
    namedExports: { getPackageNames: getPackageNamesMock },
  });
  const packageUsageModule = mock.module('./package-usage.ts', { defaultExport: packageUsageMock });
  const summaryModule = mock.module('./summary.ts', { defaultExport: summaryMock });

  const usage = (await import('./usage.ts')).default;

  beforeEach(() => {
    getPackageNamesMock.mock.resetCalls();
    packageUsageMock.mock.resetCalls();
    summaryMock.mock.resetCalls();
  });

  after(() => {
    packagesModule.restore();
    packageUsageModule.restore();
    summaryModule.restore();
  });

  it('has a summary', () => {
    const sum = {
      packagesTracked: 5,
      packagesUsage: 0.4,
      packagesUsed: 2,
    };

    summaryMock.mock.mockImplementationOnce(() => sum);

    assert.partialDeepStrictEqual(usage(), { summary: sum });
    assert.strictEqual(summaryMock.mock.calls.length, 1);
  });

  it('has packages', () => {
    const pkgUsage: PackageUsage = {
      dependencies: [],
      dependents: [],
      isImported: false,
      isUsed: false,
      modulesImported: [],
      modulesNotImported: [],
      name: 'example',
    };

    getPackageNamesMock.mock.mockImplementationOnce(() => ['example1', 'example2', 'example3']);
    const usageMocks: PackageUsage[] = [
      { ...pkgUsage, name: 'example1' },
      { ...pkgUsage, name: 'example2' },
      { ...pkgUsage, name: 'example3' },
    ];
    // @ts-expect-error undefined
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    packageUsageMock.mock.mockImplementation(() => usageMocks.shift()!);

    usage();

    assert.strictEqual(getPackageNamesMock.mock.calls.length, 1);
    assert.strictEqual(packageUsageMock.mock.calls.length, 3);
  });
});
