import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export const getFileContent = (filePath: string, fullPath = false) => {
  let fileContent = '';
  const fileFullPath = fullPath
    ? filePath
    : path.join(vscode.workspace.rootPath!, filePath);
  try {
    const fileBuffer = fs.readFileSync(fileFullPath);
    fileContent = fileBuffer.toString();
  } catch (error) {}
  return fileContent;
};

const pkg = JSON.parse(getFileContent('package.json'));

/**
 * 获取域名
 *
 * @returns
 */
export const getDomain = () => {
  return (
    (pkg['yapi-code.domain'] as string) ||
    vscode.workspace.getConfiguration().get('yapi-code.domain', '')
  );
};

/**
 * 获取项目列表
 *
 * @returns
 */
export const getProjectList = () => {
  return (
    (pkg['yapi-code.project'] as {
      name: string;
      token: string;
      domain: string;
    }[]) ||
    vscode.workspace
      .getConfiguration()
      .get<{ name: string; token: string; domain: string }[]>(
        'yapi-code.project',
        [],
      )
  );
};

/**
 * 获取代码模板列表
 *
 * @returns
 */
export const getCodeTemplateList = () => {
  return (
    (pkg['yapi-code.codeTemplate'] as { name: string; template: string }[]) ||
    vscode.workspace
      .getConfiguration()
      .get<{ name: string; template: string }[]>('yapi-code.codeTemplate', [])
  );
};

/**
 * 获取模板文件路径，默认为 codeTemplate 目录下
 *
 * @returns
 */
export const getTemplateFilePath = () => {
  return (
    (pkg['yapi-code.templatePath'] as string) ||
    vscode.workspace
      .getConfiguration()
      .get<string>('yapi-code.templatePath', 'codeTemplate')
  );
};

export const getCodeTemplateListFromFiles = () => {
  const list: { name: string; template: string; type: 'ejs' | 'hbs' }[] = [];
  if (vscode.workspace.rootPath) {
    const templateFullPath = path.join(
      vscode.workspace.rootPath,
      getTemplateFilePath(),
    );
    try {
      const templateFiles = fs
        .readdirSync(templateFullPath)
        .filter((s) => s.indexOf('.ejs') > -1 || s.indexOf('.hbs') > -1);
      templateFiles.map((s) => {
        const fileBuffer = fs.readFileSync(path.join(templateFullPath, s));
        const fileContent = fileBuffer.toString();
        list.push({
          name: s,
          template: fileContent,
          type: s.indexOf('ejs') > -1 ? 'ejs' : 'hbs',
        });
      });
    } catch (error) {}
  }
  return list;
};

export const getMockConfig = () => {
  return {
    number:
      (pkg['yapi-code.mockNumber'] as string) ||
      vscode.workspace
        .getConfiguration()
        .get<string>('yapi-code.mockNumber', 'Random.natural(1000,1000)'),
    boolean:
      (pkg['yapi-code.mockBoolean'] as string) ||
      vscode.workspace
        .getConfiguration()
        .get<string>('yapi-code.mockBoolean', 'false'),
    string:
      (pkg['yapi-code.mockString'] as string) ||
      vscode.workspace
        .getConfiguration()
        .get<string>('yapi-code.mockString', 'Random.cword(5, 7)'),
  };
};

export const getMockKeyWordEqualConfig = () => {
  return (
    pkg['yapi-code.mockKeyWordEqual'] ||
    vscode.workspace
      .getConfiguration()
      .get<any>('yapi-code.mockKeyWordEqual', {})
  );
};

export const getMockKeyWordLikeConfig = () => {
  return (
    pkg['yapi-code.mockKeyWordLike'] ||
    vscode.workspace
      .getConfiguration()
      .get<any>('yapi-code.mockKeyWordLike', {})
  );
};

/**
 * 获取本地 物料模板
 *
 * @param {('blocks' | 'snippets')} type
 */
export const getLocalMaterials = (type: 'blocks' | 'snippets') => {
  const materialsPath = path.join(
    vscode.workspace.rootPath!,
    'materials',
    type,
  );
  let materials: any[] = [];
  try {
    materials = fs.readdirSync(materialsPath).map((s) => {
      const fullPath = path.join(materialsPath, s);
      let model = {};
      let schema = {};
      let preview = {};
      let template = '';
      try {
        model = JSON.parse(
          getFileContent(path.join(fullPath, 'config', 'model.json'), true),
        );
      } catch {}
      try {
        schema = JSON.parse(
          getFileContent(path.join(fullPath, 'config', 'schema.json'), true),
        );
      } catch {}
      try {
        preview = JSON.parse(
          getFileContent(path.join(fullPath, 'config', 'preview.json'), true),
        );
      } catch {}
      if (type === 'snippets') {
        try {
          template = getFileContent(
            path.join(fullPath, 'src', 'template.ejs'),
            true,
          );
        } catch {}
      }
      return {
        path: fullPath,
        name: s,
        model: model,
        schema: schema,
        preview: preview,
        template: template,
      };
    });
  } catch {}
  return materials;
};
