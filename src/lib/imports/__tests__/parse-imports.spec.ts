import ts from 'typescript';
import parseImports from '../parse-imports.js';

describe('parse imports', () => {
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
