import chalk from 'chalk';
import chalkTemplate from 'chalk-template';
import type { ReadonlyDeep } from 'type-fest';
import type { PackageUsage, PackageUsed } from './package-usage.js';
import type { UsageSummary } from './summary.js';
import usage from './usage.js';

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const toPercentage = (num: number): string => `${(num * 100).toFixed(2)} %`;

const summaryTemplate = (summary: Readonly<UsageSummary>): string => chalkTemplate`
Package and Modules Usage
{dim --------------------------------------}

{dim Packages Tracked :} {bold ${summary.packagesTracked}}
{dim Packages Used    :} {bold ${summary.packagesUsed}}
{dim Packages Usage   :} {bold ${toPercentage(summary.packagesUsage)}}
`;

const highlightPackage = (pkg: ReadonlyDeep<PackageUsed>): string => {
  if (pkg.isImported) {
    return chalk.green(pkg.name);
  }

  if (pkg.isUsed) {
    return chalk.yellow(pkg.name);
  }

  return chalk.red(pkg.name);
};

const list = (items: readonly string[]): string => (items.length > 0 ? items.join(', ') : '-');

const packageTemplate = (pkg: ReadonlyDeep<PackageUsage>): string => chalkTemplate`
Package              : {bold ${highlightPackage(pkg)}}
{dim is Imported          :} ${pkg.isImported ? 'yes' : 'no'}
{dim is Used              :} ${pkg.isUsed ? 'yes' : 'no'}
{dim Dependencies Tracked :} ${list(pkg.dependencies.map((p) => highlightPackage(p)))}
{dim Dependants Tracked   :} ${list(pkg.dependants.map((p) => highlightPackage(p)))}
{dim Modules Imported     :} ${list(pkg.modulesImported)}
{dim Modules not Imported :} ${list(pkg.modulesNotImported)}
`;

const text = (): string => {
  const { summary, packages } = usage();
  const output = [
    summaryTemplate(summary),
    ...packages.map((pkg: ReadonlyDeep<PackageUsage>) => packageTemplate(pkg)),
  ];

  return output.join('');
};

export default text;
