import * as vscode from 'vscode';

/**
 * 获取域名
 *
 * @returns
 */
export const getDomain = () => {
  return vscode.workspace.getConfiguration().get('yapi.domain', '');
};

/**
 * 获取项目列表
 *
 * @returns
 */
export const getProjectList = () => {
  return vscode.workspace
    .getConfiguration()
    .get<{ name: string; token: string; domain: string }[]>('yapi.project', []);
};

/**
 * 获取代码模板列表
 *
 * @returns
 */
export const getCodeTemplateList = () => {
  return vscode.workspace
    .getConfiguration()
    .get<{ name: string; template: string }[]>('yapi.codeTemplate', []);
};
