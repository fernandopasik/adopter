import { beforeEach, describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import text from './text.ts';
import usage from './usage.ts';

jest.mock('./usage.ts');
jest.mock('../../packages/resolve-package.ts', () =>
  jest.fn(async (specifier: string) => Promise.resolve(specifier)),
);

const usageMock = jest.mocked(usage);

describe('usage text report', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const summary = {
    packagesTracked: 5,
    packagesUsage: 0.4,
    packagesUsed: 2,
  };

  const pkg = {
    dependencies: [],
    dependents: [],
    isImported: false,
    isUsed: false,
    modulesImported: [],
    modulesNotImported: [],
    name: 'example',
  };

  it('displays a title', () => {
    usageMock.mockReturnValueOnce({ packages: [], summary });

    assert.match(text(), /Package and Modules Usage/u);
  });

  it('displays a sumary', () => {
    usageMock.mockReturnValueOnce({ packages: [], summary });

    const usageText = text();

    assert.match(usageText, /Packages Tracked.*5/u);
    assert.match(usageText, /Packages Used.*2/u);
    assert.match(usageText, /Packages Usage.*40.00 %/u);
  });

  it('displays packages', () => {
    usageMock.mockReturnValueOnce({
      packages: [
        { ...pkg, name: 'example1' },
        { ...pkg, name: 'example2' },
        { ...pkg, name: 'example3' },
      ],
      summary,
    });

    const usageText = text();

    assert.match(usageText, /Package.*example1/u);
    assert.match(usageText, /Package.*example2/u);
    assert.match(usageText, /Package.*example3/u);
  });

  it('displays used and imported packages', () => {
    usageMock.mockReturnValueOnce({
      packages: [
        { ...pkg, isImported: true, isUsed: true, name: 'example1' },
        { ...pkg, isImported: false, isUsed: true, name: 'example2' },
        { ...pkg, isImported: false, isUsed: false, name: 'example3' },
      ],
      summary,
    });

    const usageText = text();

    assert.match(usageText, /Package.*example1.*\n.*is Imported.*yes.*\n.*is Used.*yes/u);
    assert.match(usageText, /Package.*example2.*\n.*is Imported.*no.*\n.*is Used.*yes/u);
    assert.match(usageText, /Package.*example3.*\n.*is Imported.*no.*\n.*is Used.*no/u);
  });

  it('displays package modules', () => {
    usageMock.mockReturnValueOnce({
      packages: [
        {
          ...pkg,
          modulesImported: ['example2', 'example3'],
          modulesNotImported: ['example4'],
          name: 'example1',
        },
      ],
      summary,
    });

    const usageText = text();

    assert.match(usageText, /Modules Imported.*example2, example3/u);
    assert.match(usageText, /Modules not Imported.*example4/u);
  });

  it('displays dependents and dependencies', () => {
    usageMock.mockReturnValueOnce({
      packages: [
        {
          ...pkg,
          dependencies: [
            { ...pkg, name: 'example2' },
            { ...pkg, name: 'example3' },
          ],
          dependents: [{ ...pkg, name: 'example4' }],
          name: 'example1',
        },
      ],
      summary,
    });

    const usageText = text();

    assert.match(usageText, /Dependencies Tracked.*example2, example3/u);
    assert.match(usageText, /Dependents Tracked.*example4/u);
  });
});
