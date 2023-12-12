#!/usr/bin/env node

const os = require('os');
const childProcess = require('child_process');

const platform = os.platform();

/* eslint-disable no-console */
async function main(argv = process.argv) {
  argv = argv.slice(2);
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
