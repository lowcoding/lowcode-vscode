import * as ejs from 'ejs';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import * as prettier from 'prettier';

export type YapiInfo = {
  query_path: { path: string };
  method: string;
  title: string;
  project_id: number;
  req_params: {
    name: string;
    desc: string;
  }[];
  _id: number;
  req_query: { required: '0' | '1'; name: string }[];
  res_body_type: 'raw' | 'json';
  res_body: string;
  username: string;
};

export type Model = {
  type: string;
  requestBodyType?: string;
  funcName: string;
  typeName: string;
  inputValues: string[];
  api?: YapiInfo;
  mockCode: string;
  mockData: string;
  jsonData: any;
  jsonKeys?: string[];
  rawSelectedText: string; // 编辑器中选中的原始文本
  rawClipboardText: string; // 系统剪切板中的原始文本
  activeTextEditorFilePath?: string; // 当前打开文件地址
  createBlockPath?: string; // 创建区块的目录
};

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
  const targetFilePath = templateFilepath
    .replace(/\.ejs$/, '')
    .replace(
      /\$\{.+?\}/gi,
      (match) => data[match.replace(/\$|\{|\}/g, '')] || '',
    );
  try {
    content = prettier.format(content, {
      singleQuote: true,
      filepath: targetFilePath,
    });
  } catch {}
  await fse.rename(templateFilepath, targetFilePath);
  await fse.writeFile(targetFilePath, content);
}
