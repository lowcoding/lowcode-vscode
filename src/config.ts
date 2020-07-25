import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * 获取域名
 *
 * @returns
 */
export const getDomain = () => {
  return vscode.workspace.getConfiguration().get('yapi-code.domain', '');
};

/**
 * 获取项目列表
 *
 * @returns
 */
export const getProjectList = () => {
  return vscode.workspace
    .getConfiguration()
    .get<{ name: string; token: string; domain: string }[]>(
      'yapi-code.project',
      [],
    );
};

/**
 * 获取代码模板列表
 *
 * @returns
 */
export const getCodeTemplateList = () => {
  return vscode.workspace
    .getConfiguration()
    .get<{ name: string; template: string }[]>('yapi-code.codeTemplate', []);
};

/**
 * 获取模板文件路径，默认为 codeTemplate 目录下
 *
 * @returns
 */
export const getTemplateFilePath = () => {
  return vscode.workspace
    .getConfiguration()
    .get<string>('yapi-code.templatePath', 'codeTemplate');
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
    number: vscode.workspace
      .getConfiguration()
      .get<string>('yapi-code.mockNumber', 'Random.natural(1000,1000)'),
    boolean: vscode.workspace
      .getConfiguration()
      .get<string>('yapi-code.mockBoolean', 'false'),
    string: vscode.workspace
      .getConfiguration()
      .get<string>('yapi-code.mockString', 'Random.cword(5, 7)'),
  };
};
