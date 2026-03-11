import path from 'path';
import { createSourceFile, ScriptTarget, type SourceFile } from 'typescript';

const parseAst = (filename: string, content: string): SourceFile | undefined => {
  const extension = path.extname(filename);

  return /.[jt]sx?/u.test(extension)
    ? createSourceFile(filename, content, ScriptTarget.Latest)
    : undefined;
};

export default parseAst;
