#!/usr/bin/env node

import cli from '../lib/cli.js';

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const processArgs = process.argv.slice(2);

await cli(processArgs);
