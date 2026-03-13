import { describe, it } from '@jest/globals';
import assert from 'node:assert/strict';
import sortPaths from './sort-paths.ts';

describe('sort paths', () => {
  it('with empty list', () => {
    assert.deepStrictEqual(sortPaths(), []);
  });

  it('with a single path', () => {
    assert.deepStrictEqual(sortPaths(['example.js']), ['example.js']);
  });

  it('with same folder files', () => {
    assert.deepStrictEqual(sortPaths(['example2.js', 'example1.js', 'example3.js']), [
      'example1.js',
      'example2.js',
      'example3.js',
    ]);
  });

  it('with hidden files', () => {
    assert.deepStrictEqual(sortPaths(['example2.js', 'example1.js', '.example3.js']), [
      '.example3.js',
      'example1.js',
      'example2.js',
    ]);
  });

  it('with folder and files', () => {
    assert.deepStrictEqual(
      sortPaths(['src/example2.js', 'src/example1.js', 'example3.js', 'zzz.js']),
      ['example3.js', 'zzz.js', 'src/example1.js', 'src/example2.js'],
    );
  });

  it('with nested folders files', () => {
    assert.deepStrictEqual(
      sortPaths([
        'src/a/example2.js',
        'src/example2.js',
        'src/a/example1.js',
        'src/example1.js',
        'example3.js',
        'zzz.js',
      ]),
      [
        'example3.js',
        'zzz.js',
        'src/example1.js',
        'src/example2.js',
        'src/a/example1.js',
        'src/a/example2.js',
      ],
    );
  });

  it('with multiple nested and non nested folders files', () => {
    assert.deepStrictEqual(
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
      [
        'example3.js',
        'zzz.js',
        'a/file.js',
        'src/example1.js',
        'src/example2.js',
        'src/a/example1.js',
        'src/a/example2.js',
        'test/file.js',
      ],
    );
  });
});
