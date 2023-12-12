#!/usr/bin/env node

const os = require('os');
const childProcess = require('child_process');

const platform = os.platform();

/* eslint-disable no-console */
async function main(argv = process.argv) {
  argv = argv.slice(2);
  const secretBulkAPIArgs = [
    'secret:bulk',
    '--config',
    './api/wrangler.toml',
    ...argv,
  ];
  console.error(['wrangler', ...secretBulkAPIArgs].join(' '));
  childProcess.execFileSync('wrangler', secretBulkAPIArgs, {
    input: JSON.stringify({
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      ZENHUB_TOKEN: process.env.ZENHUB_TOKEN,
    }),
  });
  const publishAPIArgs = [
    'publish',
    '--config',
    './api/wrangler.toml',
    ...argv,
  ];
  console.error(['wrangler', ...publishAPIArgs].join(' '));
  childProcess.execFileSync('wrangler', publishAPIArgs, {
    stdio: ['inherit', 'inherit', 'inherit'],
    windowsHide: true,
    encoding: 'utf-8',
    shell: platform === 'win32' ? true : false,
  });
  const publishArgs = ['publish', '--config', './wrangler.toml', ...argv];
  console.error(['wrangler', ...publishArgs].join(' '));
  childProcess.execFileSync('wrangler', publishArgs, {
    stdio: ['inherit', 'inherit', 'inherit'],
    windowsHide: true,
    encoding: 'utf-8',
    shell: platform === 'win32' ? true : false,
  });
}
/* eslint-enable no-console */

void main();
