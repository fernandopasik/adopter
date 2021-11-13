import { getPackageNames } from '../../packages/index.js';
import type { PackageUsage } from './package-usage.js';
import packageUsage from './package-usage.js';
import type { UsageSummary } from './summary.js';
import summary from './summary.js';

export interface Usage {
  summary: UsageSummary;
  packages: PackageUsage[];
}

const usage = (): Usage => ({
  summary: summary(),
  packages: getPackageNames().map((packageName) => packageUsage(packageName)),
});

export default usage;
