import log from 'loglevel';

const print = (text = ''): void => {
  const currentLogLevel = log.getLevel();
  log.setLevel('INFO');
  log.info(text);
  log.setLevel(currentLogLevel);
};

export default print;
