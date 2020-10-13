import axios from 'axios';
import * as path from 'path';
const fs = require('fs-extra');

export function download(url: string, filePath: string, fileName: string) {
  return new Promise((resolve, reject) => {
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
              .on('finish', () => resolve())
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
}
