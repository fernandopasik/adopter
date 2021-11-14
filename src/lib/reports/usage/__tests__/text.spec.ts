import text from '../text.js';
import usage from '../usage.js';

jest.mock('../usage.js');
jest.mock('../../../packages/resolve-package.js', () =>
  jest.fn(async (specifier: string) => Promise.resolve(specifier)),
);

const usageMock = usage as jest.MockedFunction<typeof usage>;

describe('usage text report', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const summary = {
    packagesTracked: 5,
    packagesUsed: 2,
    packagesUsage: 0.4,
  };

  const pkg = {
    name: 'example',
    isImported: false,
    isUsed: false,
    dependents: [],
    dependencies: [],
    modulesImported: [],
    modulesNotImported: [],
  };

  it('displays a title', () => {
    usageMock.mockReturnValueOnce({ summary, packages: [] });

    expect(text()).toContain('Package and Modules Usage');
  });

  it('displays a sumary', () => {
    usageMock.mockReturnValueOnce({ summary, packages: [] });

    const usageText = text();

    expect(usageText).toStrictEqual(expect.stringMatching('Packages Tracked.*5'));
    expect(usageText).toStrictEqual(expect.stringMatching('Packages Used.*2'));
    expect(usageText).toStrictEqual(expect.stringMatching('Packages Usage.*40.00 %'));
  });

  it('displays packages', () => {
    usageMock.mockReturnValueOnce({
      summary,
      packages: [
        { ...pkg, name: 'example1' },
        { ...pkg, name: 'example2' },
        { ...pkg, name: 'example3' },
      ],
    });

    const usageText = text();

    expect(usageText).toStrictEqual(expect.stringMatching('Package.*example1'));
    expect(usageText).toStrictEqual(expect.stringMatching('Package.*example2'));
    expect(usageText).toStrictEqual(expect.stringMatching('Package.*example3'));
  });

  it('displays used and imported packages', () => {
    usageMock.mockReturnValueOnce({
      summary,
      packages: [
        { ...pkg, name: 'example1', isImported: true, isUsed: true },
        { ...pkg, name: 'example2', isImported: false, isUsed: true },
        { ...pkg, name: 'example3', isImported: false, isUsed: false },
      ],
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
      summary,
      packages: [
        {
          ...pkg,
          name: 'example1',
          modulesImported: ['example2', 'example3'],
          modulesNotImported: ['example4'],
        },
      ],
    });

    const usageText = text();

    expect(usageText).toStrictEqual(expect.stringMatching('Modules Imported.*example2, example3'));
    expect(usageText).toStrictEqual(expect.stringMatching('Modules not Imported.*example4'));
  });

  it('displays dependents and dependencies', () => {
    usageMock.mockReturnValueOnce({
      summary,
      packages: [
        {
          ...pkg,
          name: 'example1',
          dependencies: [
            { ...pkg, name: 'example2' },
            { ...pkg, name: 'example3' },
          ],
          dependents: [{ ...pkg, name: 'example4' }],
        },
      ],
    });

    const usageText = text();

    expect(usageText).toStrictEqual(
      expect.stringMatching('Dependencies Tracked.*example2, example3'),
    );
    expect(usageText).toStrictEqual(expect.stringMatching('Dependents Tracked.*example4'));
  });
});
