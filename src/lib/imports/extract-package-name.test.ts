import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import extractPackageName from './extract-package-name.ts';

describe('get package name', () => {
  it('with empty', () => {
    assert.strictEqual(extractPackageName(), null);
  });

  it('with valid package name', () => {
    assert.strictEqual(extractPackageName('hello'), 'hello');
  });

  it('with org scoped package', () => {
    assert.strictEqual(extractPackageName('@my/hello'), '@my/hello');
  });

  it('with file in package', () => {
    assert.strictEqual(extractPackageName('hello/world.ts'), 'hello');
  });

  it('with file in scoped package', () => {
    assert.strictEqual(extractPackageName('@hello/world/example.ts'), '@hello/world');
  });

  it('with relative path', () => {
    assert.strictEqual(extractPackageName('./src/world.ts'), null);
  });
});
