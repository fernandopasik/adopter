import { getPackageNames } from '../../packages/index.js';
import isPackageUsed from './is-package-used.js';

export interface UsageSummary {
  packagesTracked: number;
  packagesUsed: number;
  packagesUsage: number;
}

const summary = (): UsageSummary => {
  const packageNames = getPackageNames();
  const { length: packagesTracked } = packageNames;
  const { length: packagesUsed } = packageNames.filter((packageName) => isPackageUsed(packageName));
  const packagesUsage = packagesTracked === 0 ? 0 : packagesUsed / packagesTracked;

  return { packagesTracked, packagesUsed, packagesUsage };
};

export default summary;
