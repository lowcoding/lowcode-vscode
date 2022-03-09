import * as ejs from 'ejs';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import * as prettier from 'prettier';
import { Model } from './type';

export const compile = (templateString: string, model: Model) =>
  ejs.render(templateString, model);

export async function renderEjsTemplates(
  templateData: object,
  templateDir: string,
  exclude: string[] = [],
) {
  return new Promise<void>((resolve, reject) => {
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
        const templateFiles = files.filter((s) => {
          let valid = true;
          if (s.indexOf('.ejs') < 0) {
            valid = false;
          }
          if (exclude && exclude.length > 0) {
            exclude.map((e) => {
              if (s.startsWith(e)) {
                valid = false;
              }
            });
          }
          return valid;
        });
        Promise.all(
          templateFiles.map((file) => {
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
  try {
    content = prettier.format(content, {
      singleQuote: true,
      filepath: targetFilePath,
    });
  } catch {}
  await fse.rename(templateFilepath, targetFilePath);
  await fse.writeFile(targetFilePath, content);
}
