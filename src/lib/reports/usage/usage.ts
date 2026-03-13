import { getPackageNames } from '../../packages/index.ts';
import packageUsage, { type PackageUsage } from './package-usage.ts';
import summary, { type UsageSummary } from './summary.ts';

export interface Usage {
  packages: PackageUsage[];
  summary: UsageSummary;
}

const usage = (): Usage => ({
  packages: getPackageNames().map((packageName) => packageUsage(packageName)),
  summary: summary(),
});

export default usage;
