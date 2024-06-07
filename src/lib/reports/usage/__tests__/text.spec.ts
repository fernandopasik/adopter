import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import text from '../text.js';
import usage from '../usage.js';

jest.mock('../usage.js');
jest.mock('../../../packages/resolve-package.js', () =>
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

    expect(text()).toContain('Package and Modules Usage');
  });

  it('displays a sumary', () => {
    usageMock.mockReturnValueOnce({ packages: [], summary });

    const usageText = text();

    expect(usageText).toStrictEqual(expect.stringMatching('Packages Tracked.*5'));
    expect(usageText).toStrictEqual(expect.stringMatching('Packages Used.*2'));
    expect(usageText).toStrictEqual(expect.stringMatching('Packages Usage.*40.00 %'));
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

    expect(usageText).toStrictEqual(expect.stringMatching('Package.*example1'));
    expect(usageText).toStrictEqual(expect.stringMatching('Package.*example2'));
    expect(usageText).toStrictEqual(expect.stringMatching('Package.*example3'));
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

    expect(usageText).toStrictEqual(
      expect.stringMatching('Package.*example1.*\n.*is Imported.*yes.*\n.*is Used.*yes'),
    );
    expect(usageText).toStrictEqual(
      expect.stringMatching('Package.*example2.*\n.*is Imported.*no.*\n.*is Used.*yes'),
    );
    expect(usageText).toStrictEqual(
      expect.stringMatching('Package.*example3.*\n.*is Imported.*no.*\n.*is Used.*no'),
    );
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

    expect(usageText).toStrictEqual(expect.stringMatching('Modules Imported.*example2, example3'));
    expect(usageText).toStrictEqual(expect.stringMatching('Modules not Imported.*example4'));
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

    expect(usageText).toStrictEqual(
      expect.stringMatching('Dependencies Tracked.*example2, example3'),
    );
    expect(usageText).toStrictEqual(expect.stringMatching('Dependents Tracked.*example4'));
  });
});
