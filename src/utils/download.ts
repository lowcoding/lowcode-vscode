import axios from 'axios';
import * as path from 'path';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import { tempDir } from './env';

const tar = require('tar');

export const download = (url: string, filePath: string, fileName: string) =>
  new Promise((resolve, reject) => {
    fs.ensureDir(filePath)
      .then(() => {
        const file = fs.createWriteStream(path.join(filePath, fileName));
        axios({
          url,
          responseType: 'stream',
        })
          .then((response) => {
            response.data
              .pipe(file)
              .on('finish', () => resolve(0))
              .on('error', (err: any) => {
                fs.unlink(filePath, () => reject(err));
              });
          })
          .catch((ex: any) => {
            reject(ex);
          });
      })
      .catch((ex: any) => {
        reject(ex);
      });
  });

export const downloadMaterialsFromNpm = async (packageName: string) => {
  const result = execa.sync('npm', ['view', packageName, 'dist.tarball']);
  const tarball = result.stdout;
  fs.removeSync(tempDir.materials);
  await download(tarball, tempDir.temp, `temp.tgz`);
  if (!fs.existsSync(tempDir.materials)) {
    fs.mkdirSync(tempDir.materials);
  }
  await tar.x({
    file: path.join(tempDir.temp, `temp.tgz`),
    C: tempDir.materials,
    strip: 1,
  });
};

export const downloadMaterialsFromGit = (remote: string) => {
  fs.removeSync(tempDir.materials);
  execa.sync('git', ['clone', ...remote.split(' '), tempDir.materials]);
};

export const copyMaterialsFromTemp = (
  from: { blocks: string[]; snippets: string[] },
  to: string,
) => {
  from.blocks.map((s) => {
    fs.copySync(
      path.join(tempDir.blockMaterials, s),
      fs.existsSync(path.join(to, 'blocks', s))
        ? path.join(to, 'blocks', `${s} copy`)
        : path.join(to, 'blocks', s),
    );
  });
  from.snippets.map((s) => {
    fs.copySync(
      path.join(tempDir.snippetMaterials, s),
      fs.existsSync(path.join(to, 'snippets', s))
        ? path.join(to, 'snippets', `${s} copy`)
        : path.join(to, 'snippets', s),
    );
  });

  fs.removeSync(tempDir.materials);
};
