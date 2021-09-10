import type { ReadonlyDeep } from 'type-fest';
import ts from 'typescript';
import parseImports, { parseImport } from '../parse-imports.js';

describe('parse imports', () => {
  describe('parse import', () => {
    it('without default nor named imports', () => {
      const {
        statements: [statement],
      } = ts.createSourceFile('example.ts', 'import "./dep.ts"', ts.ScriptTarget.Latest);

      expect(parseImport(statement as ReadonlyDeep<ts.ImportDeclaration>)).toStrictEqual({
        moduleSpecifier: './dep.ts',
        packageName: null,
        defaultName: undefined,
        named: undefined,
      });
    });

    it('with only default import', () => {
      const {
        statements: [statement],
      } = ts.createSourceFile('example.ts', 'import dep from "./dep.ts"', ts.ScriptTarget.Latest);

      expect(parseImport(statement as ReadonlyDeep<ts.ImportDeclaration>)).toStrictEqual({
        moduleSpecifier: './dep.ts',
        packageName: null,
        defaultName: 'dep',
        named: undefined,
      });
    });

    it('with only named import', () => {
      const {
        statements: [statement],
      } = ts.createSourceFile(
        'example.ts',
        'import { dep } from "./dep.ts"',
        ts.ScriptTarget.Latest,
      );

      expect(parseImport(statement as ReadonlyDeep<ts.ImportDeclaration>)).toStrictEqual({
        moduleSpecifier: './dep.ts',
        packageName: null,
        defaultName: undefined,
        named: { dep: 'dep' },
      });
    });

    it('with multiple named imports', () => {
      const {
        statements: [statement],
      } = ts.createSourceFile(
        'example.ts',
        'import { dep1, dep2 } from "./dep.ts"',
        ts.ScriptTarget.Latest,
      );

      expect(parseImport(statement as ReadonlyDeep<ts.ImportDeclaration>)).toStrictEqual({
        moduleSpecifier: './dep.ts',
        packageName: null,
        defaultName: undefined,
        named: { dep1: 'dep1', dep2: 'dep2' },
      });
    });

    it('with named imports with alias', () => {
      const {
        statements: [statement],
      } = ts.createSourceFile(
        'example.ts',
        'import { dep1 as dep3, dep2 } from "./dep.ts"',
        ts.ScriptTarget.Latest,
      );

      expect(parseImport(statement as ReadonlyDeep<ts.ImportDeclaration>)).toStrictEqual({
        moduleSpecifier: './dep.ts',
        packageName: null,
        defaultName: undefined,
        named: { dep1: 'dep3', dep2: 'dep2' },
      });
    });

    it('with default and named imports', () => {
      const {
        statements: [statement],
      } = ts.createSourceFile(
        'example.ts',
        'import dep, { dep1, dep2 } from "./dep.ts"',
        ts.ScriptTarget.Latest,
      );

      expect(parseImport(statement as ReadonlyDeep<ts.ImportDeclaration>)).toStrictEqual({
        moduleSpecifier: './dep.ts',
        packageName: null,
        defaultName: 'dep',
        named: { dep1: 'dep1', dep2: 'dep2' },
      });
    });

    it('with default and named imports with alias', () => {
      const {
        statements: [statement],
      } = ts.createSourceFile(
        'example.ts',
        'import dep, { dep1, dep2 as dep3 } from "./dep.ts"',
        ts.ScriptTarget.Latest,
      );

      expect(parseImport(statement as ReadonlyDeep<ts.ImportDeclaration>)).toStrictEqual({
        moduleSpecifier: './dep.ts',
        packageName: null,
        defaultName: 'dep',
        named: { dep1: 'dep1', dep2: 'dep3' },
      });
    });

    it('with a type import', () => {
      const {
        statements: [statement],
      } = ts.createSourceFile(
        'example.ts',
        'import type { Dep } from "./dep.ts"',
        ts.ScriptTarget.Latest,
      );

      expect(parseImport(statement as ReadonlyDeep<ts.ImportDeclaration>)).toStrictEqual({
        moduleSpecifier: './dep.ts',
        packageName: null,
        defaultName: undefined,
        named: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Dep: 'Dep',
        },
      });
    });
  });

  describe('with multiple', () => {
    it('default imports', () => {
      const source = ts.createSourceFile(
        'example.ts',
        'import dep1 from "dep1"; import dep2 from "dep2";',
        ts.ScriptTarget.Latest,
      );

      expect(parseImports(source)).toMatchInlineSnapshot(`
Array [
  Object {
    "defaultName": "dep1",
    "moduleSpecifier": "dep1",
    "named": undefined,
    "packageName": "dep1",
  },
  Object {
    "defaultName": "dep2",
    "moduleSpecifier": "dep2",
    "named": undefined,
    "packageName": "dep2",
  },
]
`);
    });

    it('default and named imports', () => {
      const source = ts.createSourceFile(
        'example.ts',
        'import dep1 from "dep1"; import { dep2, dep3 } from "dep2";',
        ts.ScriptTarget.Latest,
      );

      expect(parseImports(source)).toMatchInlineSnapshot(`
Array [
  Object {
    "defaultName": "dep1",
    "moduleSpecifier": "dep1",
    "named": undefined,
    "packageName": "dep1",
  },
  Object {
    "defaultName": undefined,
    "moduleSpecifier": "dep2",
    "named": Object {
      "dep2": "dep2",
      "dep3": "dep3",
    },
    "packageName": "dep2",
  },
]
`);
    });

    it('unnamed, default and named imports with alias', () => {
      const source = ts.createSourceFile(
        'example.ts',
        'import dep1 from "dep1"; import { dep2, dep3 as dep4 } from "dep2"; import "dep5"',
        ts.ScriptTarget.Latest,
      );

      expect(parseImports(source)).toMatchInlineSnapshot(`
Array [
  Object {
    "defaultName": "dep1",
    "moduleSpecifier": "dep1",
    "named": undefined,
    "packageName": "dep1",
  },
  Object {
    "defaultName": undefined,
    "moduleSpecifier": "dep2",
    "named": Object {
      "dep2": "dep2",
      "dep3": "dep4",
    },
    "packageName": "dep2",
  },
  Object {
    "defaultName": undefined,
    "moduleSpecifier": "dep5",
    "named": undefined,
    "packageName": "dep5",
  },
]
`);
    });

    it('imports and non imports', () => {
      const source = ts.createSourceFile(
        'example.ts',
        'import dep1 from "dep1"; import { dep2 } from "dep2"; console.log(true)',
        ts.ScriptTarget.Latest,
      );

      expect(parseImports(source)).toMatchInlineSnapshot(`
Array [
  Object {
    "defaultName": "dep1",
    "moduleSpecifier": "dep1",
    "named": undefined,
    "packageName": "dep1",
  },
  Object {
    "defaultName": undefined,
    "moduleSpecifier": "dep2",
    "named": Object {
      "dep2": "dep2",
    },
    "packageName": "dep2",
  },
]
`);
    });

    it('module imports and type imports', () => {
      const source = ts.createSourceFile(
        'example.ts',
        'import dep1 from "dep1"; import type { Dep2 } from "dep2"; console.log(true)',
        ts.ScriptTarget.Latest,
      );

      expect(parseImports(source)).toMatchInlineSnapshot(`
Array [
  Object {
    "defaultName": "dep1",
    "moduleSpecifier": "dep1",
    "named": undefined,
    "packageName": "dep1",
  },
  Object {
    "defaultName": undefined,
    "moduleSpecifier": "dep2",
    "named": Object {
      "Dep2": "Dep2",
    },
    "packageName": "dep2",
  },
]
`);
    });

    it('relative imports', () => {
      const source = ts.createSourceFile(
        'example.ts',
        'import dep1 from "dep1"; import dep2 from "./dep2/example.ts"',
        ts.ScriptTarget.Latest,
      );

      expect(parseImports(source)).toMatchInlineSnapshot(`
Array [
  Object {
    "defaultName": "dep1",
    "moduleSpecifier": "dep1",
    "named": undefined,
    "packageName": "dep1",
  },
  Object {
    "defaultName": "dep2",
    "moduleSpecifier": "./dep2/example.ts",
    "named": undefined,
    "packageName": null,
  },
]
`);
    });

    it('internal files in package imports', () => {
      const source = ts.createSourceFile(
        'example.ts',
        'import dep1 from "dep1"; import dep2 from "dep2/example.ts"',
        ts.ScriptTarget.Latest,
      );

      expect(parseImports(source)).toMatchInlineSnapshot(`
Array [
  Object {
    "defaultName": "dep1",
    "moduleSpecifier": "dep1",
    "named": undefined,
    "packageName": "dep1",
  },
  Object {
    "defaultName": "dep2",
    "moduleSpecifier": "dep2/example.ts",
    "named": undefined,
    "packageName": "dep2",
  },
]
`);
    });
  });
});
