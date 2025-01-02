const path = require('path');
const fs = require('fs-extra');
const { build } = require('esbuild');

fs.removeSync(path.join(__dirname, 'build'));
const entryFile = path.join(__dirname, 'src', 'extension.ts');
build({
  entryPoints: [entryFile],
  bundle: true,
  minify: true,
  // only needed if you have dependencies
  external: ['vscode'],
  platform: 'node',
  format: 'cjs',
  outfile: path.join(__dirname, 'build', 'extension.js'),
  write: true,
  logLevel: 'error',
});
