import { describe, it } from '@jest/globals';
import assert from 'node:assert/strict';
import extractPackagePath from './extract-package-path.ts';

describe('extract package path', () => {
  it('with empty module url', () => {
    assert.strictEqual(extractPackagePath(), '');
  });

  it('with module url and empty package name', () => {
    const moduleUrl = '/my-project/node_modules/my-package/main.js';
    assert.strictEqual(extractPackagePath(moduleUrl), '');
  });

  it('with module url and package name', () => {
    const moduleUrl = '/my-project/node_modules/my-package/main.js';
    assert.strictEqual(
      extractPackagePath(moduleUrl, 'my-package'),
      '/my-project/node_modules/my-package',
    );
  });

  it('with module url and unmatched package name', () => {
    const moduleUrl = '/my-project/node_modules/my-package/main.js';
    assert.strictEqual(extractPackagePath(moduleUrl, 'my-package2'), moduleUrl);
  });
});
