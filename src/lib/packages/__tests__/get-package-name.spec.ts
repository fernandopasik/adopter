import getPackageName from '../get-package-name.js';

jest.mock('../resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('get package name', () => {
  it('with empty', () => {
    expect(getPackageName()).toBeNull();
  });

  it('with valid package name', () => {
    expect(getPackageName('hello')).toBe('hello');
  });

  it('with org scoped package', () => {
    expect(getPackageName('@my/hello')).toBe('@my/hello');
  });

  it('with file in package', () => {
    expect(getPackageName('hello/world.ts')).toBe('hello');
  });

  it('with file in scoped package', () => {
    expect(getPackageName('@hello/world/example.ts')).toBe('@hello/world');
  });

  it('with relative path', () => {
    expect(getPackageName('./src/world.ts')).toBeNull();
  });
});
