const extractPackagePath = (mainModuleUrl = '', packageName = ''): string =>
  mainModuleUrl
    // eslint-disable-next-line security/detect-non-literal-regexp
    .replace(new RegExp(`${packageName}.*$`, 'mu'), packageName)
    .replace('file://', '');

export default extractPackagePath;
