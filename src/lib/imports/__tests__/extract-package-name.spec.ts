import { describe, expect, it } from '@jest/globals';
import extractPackageName from '../extract-package-name.js';

describe('get package name', () => {
  it('with empty', () => {
    expect(extractPackageName()).toBeNull();
  });

  it('with valid package name', () => {
    expect(extractPackageName('hello')).toBe('hello');
  });

  it('with org scoped package', () => {
    expect(extractPackageName('@my/hello')).toBe('@my/hello');
  });

  it('with file in package', () => {
    expect(extractPackageName('hello/world.ts')).toBe('hello');
  });

  it('with file in scoped package', () => {
    expect(extractPackageName('@hello/world/example.ts')).toBe('@hello/world');
  });

  it('with relative path', () => {
    expect(extractPackageName('./src/world.ts')).toBeNull();
  });
});
