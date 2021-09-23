import type { ReadonlyDeep } from 'type-fest';
import ts from 'typescript';
import parseImport from '../parse-import.js';

jest.mock('../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));

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
      moduleNames: [],
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
      moduleNames: ['default'],
    });
  });

  it('with only named import', () => {
    const {
      statements: [statement],
    } = ts.createSourceFile('example.ts', 'import { dep } from "./dep.ts"', ts.ScriptTarget.Latest);

    expect(parseImport(statement as ReadonlyDeep<ts.ImportDeclaration>)).toStrictEqual({
      moduleSpecifier: './dep.ts',
      packageName: null,
      defaultName: undefined,
      named: { dep: 'dep' },
      moduleNames: ['dep'],
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
      moduleNames: ['dep1', 'dep2'],
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
      moduleNames: ['dep1', 'dep2'],
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
      moduleNames: ['default', 'dep1', 'dep2'],
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
      moduleNames: ['default', 'dep1', 'dep2'],
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
      moduleNames: ['Dep'],
    });
  });
});
