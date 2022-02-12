import ts from 'typescript';

export const areNamedImports = (
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  namedBindings?: ts.NamedImportBindings,
): namedBindings is ts.NamedImports =>
  typeof namedBindings !== 'undefined' && ts.isNamedImports(namedBindings);

export default areNamedImports;
