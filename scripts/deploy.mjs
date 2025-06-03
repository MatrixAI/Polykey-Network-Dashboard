#!/usr/bin/env node

import os from 'node:os';
import fs from 'node:fs';
import url from 'node:url';
import process from 'node:process';
import childProcess from 'node:child_process';
import TOML from '@iarna/toml';
import $RefParser from '@apidevtools/json-schema-ref-parser';

const platform = os.platform();

async function loadEnvSchema() {
  const schema = await $RefParser.bundle('env.schema.json');
  const props = new Set();
  const required = new Set();
  (function extract(s) {
    if (!s || typeof s !== 'object') return;
    // Collect properties
    if (s.properties) Object.keys(s.properties).forEach((k) => props.add(k));
    // Collect required properties
    if (s.required) s.required.forEach((r) => required.add(r));
    // Process composition keywords
    ['allOf', 'anyOf', 'oneOf'].forEach(
      (k) => Array.isArray(s[k]) && s[k].forEach(extract),
    );
  })(schema);
  return {
    allKeys: [...props],
    requiredKeys: [...required],
  };
}

/* eslint-disable no-console */
async function main(argv = process.argv) {
  argv = argv.slice(2);
  // Optional feature is used for feature branches
  let feature;
  const restArgs = [];
  while (argv.length > 0) {
    const option = argv.shift();
    let match;
    if ((match = option.match(/--feature(?:=(.+)|$)/))) {
      feature = match[1] ?? argv.shift();
    } else {
      restArgs.push(option);
    }
  }
  // The `--feature X` option only makes sense if you also use `--env X`.
  if (typeof feature === 'string') {
    const wranglerConfig = TOML.parse(
      fs.readFileSync('./wrangler.toml', { encoding: 'utf-8' }),
    );
    // Backup the original wrangler.toml
    fs.renameSync('./wrangler.toml', './wrangler.toml.bak');
    // All the handlers for swapping back the original wrangler.toml
    process.on('beforeExit', () => {
      try {
        fs.renameSync('./wrangler.toml.bak', './wrangler.toml');
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
      }
    });
    process.on('uncaughtException', () => {
      try {
        fs.renameSync('./wrangler.toml.bak', './wrangler.toml');
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
      }
    });
    process.on('unhandledRejection', () => {
      try {
        fs.renameSync('./wrangler.toml.bak', './wrangler.toml');
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
      }
    });
    process.on('SIGINT', () => {
      try {
        fs.renameSync('./wrangler.toml.bak', './wrangler.toml');
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
      }
    });
    process.on('SIGTERM', () => {
      try {
        fs.renameSync('./wrangler.toml.bak', './wrangler.toml');
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
      }
    });
    process.on('SIGQUIT', () => {
      try {
        fs.renameSync('./wrangler.toml.bak', './wrangler.toml');
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
      }
    });
    process.on('SIGHUP', () => {
      try {
        fs.renameSync('./wrangler.toml.bak', './wrangler.toml');
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
      }
    });
    // Add in the feature environment
    wranglerConfig.env[feature] = {
      name: `${wranglerConfig.name}-${feature}`,
      routes: wranglerConfig.routes.map((r) => ({
        pattern: `${feature}.${r.pattern}`,
        custom_domain: true,
      })),
      durable_objects: {
        bindings: [...(wranglerConfig.durable_objects?.bindings ?? [])],
      },
      migrations: [...(wranglerConfig.migrations ?? [])],
    };
    fs.writeFileSync('./wrangler.toml', TOML.stringify(wranglerConfig), {
      encoding: 'utf-8',
    });
  }
  const { allKeys, requiredKeys } = await loadEnvSchema();
  // Check if required variables are set
  for (const key of requiredKeys) {
    if (process.env[key] == null || process.env[key] === '') {
      throw new Error(`Required environment variable ${key} is not set`);
    }
  }
  const secretBulkArgs = [
    'secret',
    'bulk',
    '--config',
    './wrangler.toml',
    ...restArgs,
  ];
  console.error(['wrangler', ...secretBulkArgs].join(' '));
  const secrets = {};
  for (const key of allKeys) {
    secrets[key] = process.env[key];
  }
  try {
    childProcess.execFileSync('wrangler', secretBulkArgs, {
      input: JSON.stringify(secrets),
      stdio: ['pipe', 'inherit', 'inherit'],
      encoding: 'utf-8',
    });
    console.log('✅ Secrets uploaded. Proceeding to deploy...');
  } catch (err) {
    console.error('❌ Secret upload failed:', err.message);
    process.exit(1);
  }
  const deployArgs = ['deploy', '--config', './wrangler.toml', ...restArgs];
  console.error(['wrangler', ...deployArgs].join(' '));
  childProcess.execFileSync('wrangler', deployArgs, {
    stdio: ['inherit', 'inherit', 'inherit'],
    windowsHide: true,
    encoding: 'utf-8',
    shell: platform === 'win32' ? true : false,
  });
}
/* eslint-enable no-console */

if (import.meta.url.startsWith('file:')) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    void main();
  }
}
