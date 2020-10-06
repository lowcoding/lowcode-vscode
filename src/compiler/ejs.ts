import * as ejs from 'ejs';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import * as prettier from 'prettier';
import { Model } from './type';

export const compile = (templateString: string, model: Model) => {
  return ejs.render(templateString, model);
};

export async function renderEjsTemplates(
  templateData: object,
  templateDir: string,
) {
  return new Promise((resolve, reject) => {
    glob(
      '**',
      {
        cwd: templateDir,
        ignore: ['node_modules/**'],
        nodir: true,
        dot: true,
      },
      (err, files) => {
        if (err) {
          return reject(err);
        }

        Promise.all(
          files.map((file) => {
            const filepath = path.join(templateDir, file);
            return renderFile(filepath, templateData);
          }),
        )
          .then(() => resolve())
          .catch(reject);
      },
    );
  });
}

async function renderFile(templateFilepath: string, data: ejs.Data) {
  let content = await ejs.renderFile(templateFilepath, data);
  const targetFilePath = templateFilepath.replace(/\.ejs$/, '');
  if (targetFilePath.match(/tsx$|jsx$/)) {
    // TODO: 需要对换行进行进一步的处理。
    content = prettier.format(content, {
      singleQuote: true,
      filepath: targetFilePath,
    });
  }
  await fse.rename(templateFilepath, targetFilePath); // 去掉模板文件后缀
  await fse.writeFile(targetFilePath, content); // render 后的内容重新写入文件
}
