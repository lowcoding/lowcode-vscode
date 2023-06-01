import * as path from 'path';
import * as fs from 'fs-extra';
import { ConfigurationTarget, workspace } from 'vscode';
import { getFileContent } from './file';
import { rootPath } from './vscodeEnv';

const defaultConfig: Config = {
  yapi: { projects: [] },
  mock: { mockKeyWordEqual: [], mockKeyWordLike: [] },
  commonlyUsedBlock: [],
};

export type Config = {
  yapi?: {
    domain?: string;
    projects?: {
      name: string;
      token: string;
      domain: string;
    }[];
  };
  mock?: {
    mockNumber?: string;
    mockBoolean?: string;
    mockString?: string;
    mockKeyWordEqual?: {
      key: string;
      value: string;
    }[];
    mockKeyWordLike?: {
      key: string;
      value: string;
    }[];
  };
  commonlyUsedBlock?: string[];
};

type ChatGPTConfig = {
  hostname: string;
  apiPath: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
};

export const getConfig = () => {
  let config: Config;
  if (fs.existsSync(path.join(rootPath, '.lowcoderc'))) {
    config = JSON.parse(getFileContent('.lowcoderc') || '{}');
  } else {
    config = getAllConfig();
  }
  return { ...defaultConfig, ...config };
};

export const saveConfig = (config: Config) => {
  fs.writeFileSync(
    path.join(rootPath, '.lowcoderc'),
    JSON.stringify(config, null, 2),
  );
};

export const getChatGPTConfig = () => {
  const hostname = workspace
    .getConfiguration('lowcode')
    .get<string>('hostname', 'api.openai.com');
  const apiPath = workspace
    .getConfiguration('lowcode')
    .get<string>('apiPath', '/v1/chat/completions');
  const apiKey = workspace
    .getConfiguration('lowcode')
    .get<string>('apiKey', '');
  const model = workspace
    .getConfiguration('lowcode')
    .get<string>('model', 'gpt-3.5-turbo');
  const maxTokens = workspace
    .getConfiguration('lowcode')
    .get<number>('maxTokens', 2000);
  const temperature = workspace
    .getConfiguration('lowcode')
    .get<number>('temperature', 0.3);

  return {
    hostname,
    apiPath,
    apiKey,
    model,
    maxTokens,
    temperature,
  };
};

/**
 * 获取域名
 *
 * @returns
 */
const getDomain = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return (pkg['yapi-code.domain'] as string) || '';
};

/**
 * 获取项目列表
 *
 * @returns
 */
const getProjectList = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return (
    (pkg['yapi-code.project'] as {
      name: string;
      token: string;
      domain: string;
    }[]) || []
  );
};

/**
 * 获取模板文件路径，默认为 codeTemplate 目录下
 *
 * @returns
 */
export const getTemplateFilePath = () => 'codeTemplate';

const getMockConfig = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return {
    number:
      (pkg['yapi-code.mockNumber'] as string) || 'Random.natural(1000,1000)',
    boolean: (pkg['yapi-code.mockBoolean'] as string) || 'false',
    string: (pkg['yapi-code.mockString'] as string) || 'Random.cword(5, 7)',
  };
};

const getMockKeyWordEqualConfig = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return pkg['yapi-code.mockKeyWordEqual'] || {};
};

const getMockKeyWordLikeConfig = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return pkg['yapi-code.mockKeyWordLike'] || {};
};

/**
 * @description 获取常用区块物料
 */
const getCommonlyUsedBlock = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return (pkg['lowcode.commonlyUsedBlock'] as string[]) || [];
};

const getAllConfig: () => Config = () => {
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
    commonlyUsedBlock: getCommonlyUsedBlock(),
  };
};
