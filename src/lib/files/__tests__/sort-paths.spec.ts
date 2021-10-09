import sortPaths from '../sort-paths.js';

describe('sort paths', () => {
  it('with empty list', () => {
    expect(sortPaths()).toStrictEqual([]);
  });

  it('with a single path', () => {
    expect(sortPaths(['example.js'])).toStrictEqual(['example.js']);
  });

  it('with same folder files', () => {
    expect(sortPaths(['example2.js', 'example1.js', 'example3.js'])).toStrictEqual([
      'example1.js',
      'example2.js',
      'example3.js',
    ]);
  });

  it('with hidden files', () => {
    expect(sortPaths(['example2.js', 'example1.js', '.example3.js'])).toStrictEqual([
      '.example3.js',
      'example1.js',
      'example2.js',
    ]);
  });

  it('with folder and files', () => {
    expect(
      sortPaths(['src/example2.js', 'src/example1.js', 'example3.js', 'zzz.js']),
    ).toStrictEqual(['example3.js', 'zzz.js', 'src/example1.js', 'src/example2.js']);
  });

  it('with nested folders files', () => {
    expect(
      sortPaths([
        'src/a/example2.js',
        'src/example2.js',
        'src/a/example1.js',
        'src/example1.js',
        'example3.js',
        'zzz.js',
      ]),
    ).toStrictEqual([
      'example3.js',
      'zzz.js',
      'src/example1.js',
      'src/example2.js',
      'src/a/example1.js',
      'src/a/example2.js',
    ]);
  });

  it('with multiple nested and non nested folders files', () => {
    expect(
      sortPaths([
        'src/a/example2.js',
        'src/example2.js',
        'a/file.js',
        'test/file.js',
        'src/a/example1.js',
        'src/example1.js',
        'example3.js',
        'zzz.js',
      ]),
    ).toStrictEqual([
      'example3.js',
      'zzz.js',
      'a/file.js',
      'src/example1.js',
      'src/example2.js',
      'src/a/example1.js',
      'src/a/example2.js',
      'test/file.js',
    ]);
  });
});
