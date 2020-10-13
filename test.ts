import * as execa from 'execa';
import * as path from 'path';
import * as fs from 'fs-extra';
const zlib = require('zlib');
const tar = require('tar');
import { cwd } from 'process';
import { download } from './src/utils/download';
const result = execa.sync('npm', ['view', 'vue', 'dist.tarball']);
const tempDir = path.join(cwd(), '.lowcode');
download(result.stdout, tempDir, 'vue.tgz').then(() => {
  fs.createReadStream(path.join(tempDir, 'vue.tgz'))
    .on('error', console.log)
    .pipe(zlib.Unzip())
    .pipe(
      tar.extract({
        path: tempDir,
        strip: 1,
      }),
    );
});
