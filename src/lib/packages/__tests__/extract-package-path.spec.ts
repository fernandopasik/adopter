import { describe, expect, it } from '@jest/globals';
import extractPackagePath from '../extract-package-path.js';

describe('extract package path', () => {
  it('with empty module url', () => {
    expect(extractPackagePath()).toBe('');
  });

  it('with module url and empty package name', () => {
    const moduleUrl = '/my-project/node_modules/my-package/main.js';
    expect(extractPackagePath(moduleUrl)).toBe('');
  });

  it('with module url and package name', () => {
    const moduleUrl = '/my-project/node_modules/my-package/main.js';
    expect(extractPackagePath(moduleUrl, 'my-package')).toBe('/my-project/node_modules/my-package');
  });

  it('with module url and unmatched package name', () => {
    const moduleUrl = '/my-project/node_modules/my-package/main.js';
    expect(extractPackagePath(moduleUrl, 'my-package2')).toBe(moduleUrl);
  });
});
