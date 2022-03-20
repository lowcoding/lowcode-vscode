import * as vscode from 'vscode';
import { getFileContent } from './utils/file';

/**
 * 获取域名
 *
 * @returns
 */
export const getDomain = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
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
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
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
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
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
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return (
    (pkg['yapi-code.templatePath'] as string) ||
    vscode.workspace
      .getConfiguration()
      .get<string>('yapi-code.templatePath', 'codeTemplate')
  );
};

export const getMockConfig = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
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
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return (
    pkg['yapi-code.mockKeyWordEqual'] ||
    vscode.workspace
      .getConfiguration()
      .get<any>('yapi-code.mockKeyWordEqual', {})
  );
};

export const getMockKeyWordLikeConfig = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return (
    pkg['yapi-code.mockKeyWordLike'] ||
    vscode.workspace
      .getConfiguration()
      .get<any>('yapi-code.mockKeyWordLike', {})
  );
};

export const getAllConfig = () => {
  const mockConfig = getMockConfig();
  const mockKeyWordEqualConfig = getMockKeyWordEqualConfig();
  const mockKeyWordLikeConfig = getMockKeyWordLikeConfig();
  return {
    yapi: {
      domain: getDomain(),
      projects: getProjectList(),
    },
    mock: {
      mockNumber: mockConfig.number,
      mockBoolean: mockConfig.boolean,
      mockString: mockConfig.string,
      mockKeyWordEqual: Object.keys(mockKeyWordEqualConfig).map((s) => ({
        key: s,
        value: mockKeyWordEqualConfig[s],
      })),
      mockKeyWordLike: Object.keys(mockKeyWordLikeConfig).map((s) => ({
        key: s,
        value: mockKeyWordLikeConfig[s],
      })),
    },
  };
};

export const saveAllConfig = (config: {
  yapi: {
    domain: string;
    projects: {
      name: string;
      token: string;
      domain: string;
    }[];
  };
  mock: {
    mockNumber: string;
    mockBoolean: string;
    mockString: string;
    mockKeyWordEqual: { [k: string]: string };
    mockKeyWordLike: { [k: string]: string };
  };
}) => {
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.domain', config.yapi.domain, true);
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.project', config.yapi.projects, true);
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.mockNumber', config.mock.mockNumber, true);
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.mockBoolean', config.mock.mockBoolean, true);
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.mockString', config.mock.mockString, true);
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.mockKeyWordEqual', config.mock.mockKeyWordEqual, true);
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.mockKeyWordLike', config.mock.mockKeyWordLike, true);
};
