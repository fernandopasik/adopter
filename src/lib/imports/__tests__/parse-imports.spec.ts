import ts from 'typescript';
import { addImport } from '../imports.js';
import parseImports from '../parse-imports.js';

jest.mock('../imports.js');
jest.mock('../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('parse imports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('with default imports', () => {
    const filePath = 'example.ts';
    const source = ts.createSourceFile(
      filePath,
      'import dep1 from "dep1"; import dep2 from "dep2";',
      ts.ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    expect(imports).toHaveLength(2);
    expect(imports[0]).toStrictEqual(expect.objectContaining({ moduleNames: ['default'] }));
    expect(imports[1]).toStrictEqual(expect.objectContaining({ moduleNames: ['default'] }));
  });

  it('with default and named imports', () => {
    const filePath = 'example.ts';
    const source = ts.createSourceFile(
      filePath,
      'import dep1 from "dep1"; import { moduleA, moduleB } from "dep2";',
      ts.ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    expect(imports).toHaveLength(2);
    expect(imports[0]).toStrictEqual(expect.objectContaining({ moduleNames: ['default'] }));
    expect(imports[1]).toStrictEqual(
      expect.objectContaining({ moduleNames: ['moduleA', 'moduleB'] }),
    );
  });

  it('with unnamed, default and named imports with alias', () => {
    const filePath = 'example.ts';
    const source = ts.createSourceFile(
      filePath,
      'import dep1 from "dep1"; import { moduleA, moduleB as aliasB } from "dep2"; import "dep5"',
      ts.ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    expect(imports).toHaveLength(3);
    expect(imports[0]).toStrictEqual(expect.objectContaining({ moduleNames: ['default'] }));
    expect(imports[1]).toStrictEqual(
      expect.objectContaining({ moduleNames: ['moduleA', 'moduleB'] }),
    );
    expect(imports[1]).toStrictEqual(
      expect.objectContaining({ named: { moduleA: 'moduleA', moduleB: 'aliasB' } }),
    );
    expect(imports[2]).toStrictEqual(expect.objectContaining({ moduleNames: [] }));
  });

  it('with imports and non imports', () => {
    const filePath = 'example.ts';
    const source = ts.createSourceFile(
      filePath,
      'import dep1 from "dep1"; import { moduleA } from "dep2"; console.log(true)',
      ts.ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    expect(imports).toHaveLength(2);
    expect(imports[0]).toStrictEqual(expect.objectContaining({ moduleNames: ['default'] }));
    expect(imports[1]).toStrictEqual(expect.objectContaining({ moduleNames: ['moduleA'] }));
  });

  it('with module imports and type imports', () => {
    const filePath = 'example.ts';
    const source = ts.createSourceFile(
      filePath,
      'import dep1 from "dep1"; import type { Dep2 } from "dep2"; console.log(true)',
      ts.ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    expect(imports).toHaveLength(2);
    expect(imports[0]).toStrictEqual(expect.objectContaining({ moduleNames: ['default'] }));
    expect(imports[1]).toStrictEqual(expect.objectContaining({ moduleNames: ['Dep2'] }));
  });

  it('with relative imports', () => {
    const filePath = 'example.ts';
    const source = ts.createSourceFile(
      filePath,
      'import dep1 from "dep1"; import dep2 from "./dep2/example.ts"',
      ts.ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    expect(imports).toHaveLength(2);
    expect(imports[0]).toStrictEqual(
      expect.objectContaining({ moduleNames: ['default'], packageName: 'dep1' }),
    );
    expect(imports[1]).toStrictEqual(
      expect.objectContaining({ moduleNames: ['default'], packageName: null }),
    );
  });

  it('with internal files in package imports', () => {
    const filePath = 'example.ts';
    const source = ts.createSourceFile(
      filePath,
      'import dep1 from "dep1"; import dep2 from "dep2/example.ts"',
      ts.ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    expect(imports).toHaveLength(2);
    expect(imports[0]).toStrictEqual(
      expect.objectContaining({ moduleNames: ['default'], packageName: 'dep1' }),
    );
    expect(imports[1]).toStrictEqual(
      expect.objectContaining({ moduleNames: ['default'], packageName: 'dep2' }),
    );
  });

  it('stores each import', () => {
    const filePath = 'example.ts';
    const source = ts.createSourceFile(
      filePath,
      'import dep1 from "dep1"; import dep2 from "dep2";',
      ts.ScriptTarget.Latest,
    );

    parseImports(source, filePath);

    expect(addImport).toHaveBeenCalledTimes(2);
  });
});
