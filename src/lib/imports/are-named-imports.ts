import { isNamedImports, type NamedImportBindings, type NamedImports } from 'typescript';

export const areNamedImports = (
  namedBindings?: NamedImportBindings,
): namedBindings is NamedImports =>
  typeof namedBindings !== 'undefined' && isNamedImports(namedBindings);

export default areNamedImports;
