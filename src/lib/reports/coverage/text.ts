import chalkTemplate from 'chalk-template';
import coverage, { type TrackedFile } from './coverage.js';
import type { CoverageSummary } from './summary';

const summaryTemplate = (summary: CoverageSummary): string => chalkTemplate`
Imported Packages and Modules Coverage
{dim --------------------------------------}

{dim Files Tracked      :} {bold ${summary.filesTracked}}
{dim Files with Imports :} {bold ${summary.filesWithImports}}
`;

const emptyFileTemplate = ({ filePath }: TrackedFile): string => chalkTemplate`{dim ${filePath}}`;

const fileTemplate = ({ filePath, trackedImports }: TrackedFile): string =>
  chalkTemplate`{bold.green ${filePath}}${trackedImports.map(
    (trackedImport) => chalkTemplate`
{dim  └}{blue ${trackedImport.packageName}} / {cyan ${trackedImport.moduleNames.join(',')}}`,
  )}`;

const text = (): string => {
  const { summary, files } = coverage();
  const output = [
    summaryTemplate(summary),
    ...files.map((file: TrackedFile) =>
      file.trackedImports.length > 0 ? fileTemplate(file) : emptyFileTemplate(file),
    ),
  ];

  return output.join('\n');
};

export default text;
