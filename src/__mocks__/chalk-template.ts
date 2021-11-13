export default (texts: readonly string[], ...vars: readonly string[]): string => {
  let result = '';

  texts.forEach((text, index) => {
    result += text;
    // eslint-disable-next-line security/detect-object-injection
    result += vars[index];
  });

  return result;
};
