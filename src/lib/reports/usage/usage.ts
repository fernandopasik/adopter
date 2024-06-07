import { getPackageNames } from '../../packages/index.js';
import packageUsage, { type PackageUsage } from './package-usage.js';
import summary, { type UsageSummary } from './summary.js';

export interface Usage {
  packages: PackageUsage[];
  summary: UsageSummary;
}

const usage = (): Usage => ({
  packages: getPackageNames().map((packageName) => packageUsage(packageName)),
  summary: summary(),
});

export default usage;
