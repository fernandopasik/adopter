import { getPackageNames } from '../../packages/index.ts';
import isPackageUsed from './is-package-used.ts';

export interface UsageSummary {
  packagesTracked: number;
  packagesUsage: number;
  packagesUsed: number;
}

const summary = (): UsageSummary => {
  const packageNames = getPackageNames();
  const { length: packagesTracked } = packageNames;
  const { length: packagesUsed } = packageNames.filter((packageName) => isPackageUsed(packageName));
  const packagesUsage = packagesTracked === 0 ? 0 : packagesUsed / packagesTracked;

  return { packagesTracked, packagesUsage, packagesUsed };
};

export default summary;
