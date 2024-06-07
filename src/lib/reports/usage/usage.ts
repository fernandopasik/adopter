import { getPackageNames } from '../../packages/index.js';
import packageUsage, { type PackageUsage } from './package-usage.js';
import summary, { type UsageSummary } from './summary.js';

export interface Usage {
  summary: UsageSummary;
  packages: PackageUsage[];
}

const usage = (): Usage => ({
  summary: summary(),
  packages: getPackageNames().map((packageName) => packageUsage(packageName)),
});

export default usage;
