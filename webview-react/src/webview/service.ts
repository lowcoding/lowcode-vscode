import { AxiosRequestConfig } from 'axios';
import { request } from './index';

export interface IGetLocalMaterialsResult {
  path: string;
  name: string;
  model: any;
  schema: any;
  preview: {
    title: string;
    description: string;
    img?: string | string[];
    category?: string[];
    schema?: 'form-render' | 'formily' | 'amis';
    chatGPT?: { viewPrompt?: string };
  };
  template: string;
}
/**
 * 获取本地物料列表
 *
 * @export
 * @param {('snippets' | 'blocks')} type
 * @returns
 */
export function getLocalMaterials(type: 'snippets' | 'blocks') {
  return request<IGetLocalMaterialsResult[]>({
    cmd: 'getLocalMaterials',
    data: type,
  });
}
/**
 * 插入代码片段
 *
 * @export
 * @param {{ template: string }} code
 * @returns
 */
export function insertSnippet(code: { template: string }) {
  return request({
    cmd: 'insertSnippet',
    data: code,
  });
}
/**
 * json 转 ts 类型
 *
 * @export
 * @param {{ json: Object; typeName: string }} data
 * @returns
 */
export function jsonToTs(data: { json: Object; typeName: string }) {
  return request<string>({
    cmd: 'jsonToTs',
    data,
  });
}
/**
 * 根据代码片段物料生成代码
 *
 * @export
 * @param {{ model: object; template: string }} data
 * @returns
 */
export function genCodeBySnippetMaterial(data: {
  name: string;
  model: object;
  template: string;
}) {
  return request({
    cmd: 'genCodeBySnippetMaterial',
    data,
  });
}
/**
 * 获取 yapi 域名
 *
 * @export
 * @returns
 */
export function getYapiDomain() {
  return request<string>({
    cmd: 'getYapiDomain',
  });
}

/**
 * 获取 yapi 项目列表
 *
 * @export
 * @returns
 */
export function getYapiProjects() {
  return request<{ name: string; token: string; domain: string }[]>({
    cmd: 'getYapiProjects',
  });
}

/**
 * 拉取 yapi 接口信息生成 model
 *
 * @export
 * @param {{
 *   domain: string;
 *   id: string;
 *   token: string;
 *   typeName?: string;
 *   funName?: string;
 * }} data
 * @returns
 */
export function genTemplateModelByYapi(data: {
  domain: string;
  id: string;
  token: string;
  typeName?: string;
  funName?: string;
}) {
  return request({
    cmd: 'genTemplateModelByYapi',
    data,
  });
}

type DirectoryTreeNode = {
  path: string;
  name: string;
  size: number;
  extension: string;
  type: 'file' | 'directory';
  children?: DirectoryTreeNode[];
};
/**
 * 获取当前项目目录结构
 *
 * @export
 * @returns
 */
export function getDirectoryTree() {
  return request<DirectoryTreeNode>({
    cmd: 'getDirectoryTree',
  });
}

/**
 * 根据区块物料生成代码
 *
 * @export
 * @param {{
 *   material: string;
 *   model: object;
 *   path: string;
 *   createPath: string[];
 * }} data
 * @returns
 */
export function genCodeByBlockMaterial(data: {
  material: string;
  model: object;
  path: string;
  createPath: string[];
}) {
  return request<string>({
    cmd: 'genCodeByBlockMaterial',
    data,
  });
}

export interface IDownloadMaterialsResult {
  blocks: {
    path: string;
    name: string;
    model: {};
    schema: {};
    preview: {
      title?: string;
      description?: string;
      img?: string;
      category?: string[];
    };
    template: string;
  }[];
  snippets: {
    path: string;
    name: string;
    model: {};
    schema: {};
    preview: {
      title?: string;
      description?: string;
      img?: string;
      category?: string[];
    };
    template: string;
  }[];
}

/**
 * 下载物料
 *
 * @export
 * @param {{ type: string; url: string }} data
 * @returns
 */
export function downloadMaterials(data: { type: string; url: string }) {
  return request<IDownloadMaterialsResult>({
    cmd: 'downloadMaterials',
    data,
  });
}
/**
 * @description 保存物料
 * @export
 * @param {{
 *   blocks: string[];
 *   snippets: string[];
 * }} data
 * @returns
 */
export function saveDownloadMaterials(data: {
  blocks: string[];
  snippets: string[];
}) {
  return request<string>({
    cmd: 'saveDownloadMaterials',
    data,
  });
}

/**
 * 刷新代码智能提示
 *
 * @export
 * @returns
 */
export function refreshIntelliSense() {
  return request<string>({
    cmd: 'refreshIntelliSense',
  });
}
/**
 * 快速添加代码片段
 *
 * @export
 * @param {{
 *   name: string;
 *   template: string;
 *   model: string;
 *   schema: string;
 *   preview: string;
 * }} data
 * @returns
 */
export function addSnippets(data: {
  name: string;
  template: string;
  model: string;
  schema: string;
  preview: string;
  commandPrompt: string;
  viewPrompt: string;
}) {
  return request<string>({
    cmd: 'addSnippets',
    data,
  });
}

/**
 * @description 创建区块模板
 * @export
 * @param {{
 *   name: string;
 *   template: string;
 *   model: string;
 *   schema: string;
 *   preview: string;
 * }} data
 * @returns
 */
export function createBlockTemplate(data: {
  name: string;
  template: string;
  model: string;
  schema: string;
  preview: string;
  commandPrompt: string;
  viewPrompt: string;
  private?: boolean;
}) {
  return request<string>({
    cmd: 'createBlockTemplate',
    data,
  });
}

/**
 * 获取插件配置
 *
 * @export
 * @returns
 */
export function getPluginConfig() {
  return request<{
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
      mockKeyWordEqual: {
        key: string;
        value: string;
      }[];
      mockKeyWordLike: {
        key: string;
        value: string;
      }[];
    };
  }>({
    cmd: 'getPluginConfig',
  });
}

export function savePluginConfig(data: {
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
    mockKeyWordEqual: {
      key: string;
      value: string;
    }[];
    mockKeyWordLike: {
      key: string;
      value: string;
    }[];
  };
}) {
  return request({
    cmd: 'savePluginConfig',
    data,
  });
}

/**
 * 获取脚手架列表
 *
 * @export
 * @param {string} [url]
 */
export function getScaffolds(url: string) {
  return request<
    {
      category: string;
      icon: string;
      uuid: string;
      scaffolds: {
        title: string;
        description: string;
        screenshot: string;
        repository: string;
        repositoryType: 'git' | 'npm';
        uuid: string;
      }[];
    }[]
  >({
    cmd: 'getScaffolds',
    data: {
      url,
    },
  });
}

/**
 * 下载脚手架
 *
 * @export
 * @param {({
 *   type: 'git' | 'npm';
 *   repository: string;
 * })} data
 * @returns
 */
export function downloadScaffoldByVsCode(data: {
  type: 'git' | 'npm';
  repository: string;
}) {
  return request<{
    config: { formSchema?: { schema?: object; formData?: object } };
  }>({
    cmd: 'downloadScaffold',
    data,
  });
}

/**
 * @description 使用本地脚手架
 * @export
 * @param {{ localPath?: string }} data
 * @returns
 */
export function useLocalScaffold(data: { localPath?: string }) {
  return request<{
    config: { formSchema?: { schema?: object; formData?: object } };
  }>({
    cmd: 'useLocalScaffold',
    data,
  });
}

/**
 * 选择目录
 *
 * @export
 * @returns
 */
export function selectDirectory() {
  return request<string>({
    cmd: 'selectDirectory',
  });
}

/**
 * 创建项目
 *
 * @export
 * @param {{
 *   model: any;
 *   createDir: string;
 *   immediateOpen: boolean;
 * }} data
 * @returns
 */
export function createProject(data: {
  model: any;
  createDir: string;
  immediateOpen: boolean;
}) {
  return request<string>({
    cmd: 'createProject',
    data,
  });
}

/**
 * @description 执行 vscode 命令
 * @export
 * @param {{ command: string }} data
 * @returns
 */
export function executeVscodeCommand(data: { command: string }) {
  return request<string>({
    cmd: 'executeVscodeCommand',
    data,
  });
}

export function nodeRequest<IResult = unknown>(config: AxiosRequestConfig) {
  return request<IResult>({
    cmd: 'request',
    skipError: true,
    data: {
      config,
    },
  });
}

export function askChatGPT(data: {
  sessionId: number;
  messageId: number;
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
}) {
  return request<{ sessionId: number; messageId: number; content: string }>({
    cmd: 'askChatGPT',
    data,
  });
}

export function askChatGPTWithEjsTemplate(data: {
  template: string;
  model: object;
}) {
  return request<boolean>({
    cmd: 'askChatGPTWithEjsTemplate',
    data,
  });
}

export function getTask() {
  return request<{
    task: 'addSnippets' | 'openSnippet' | 'route' | 'updateSelectedFolder';
    data?: unknown;
  }>({
    cmd: 'getTask',
  });
}

export function insertCode(code: string) {
  return request<boolean>({
    cmd: 'insertCode',
    data: code,
  });
}

export function exportChatGPTContent(content: string) {
  return request<boolean>({
    cmd: 'exportChatGPTContent',
    data: content,
  });
}

export function runScript(data: {
  materialPath: string;
  script: string;
  params: string;
  model: object;
}) {
  return request<object>({
    cmd: 'runScript',
    data,
  });
}

export function getSyncFolder() {
  return request<string>({
    cmd: 'getSyncFolder',
  });
}

export function saveSyncFolder(syncFolder: string) {
  return request<boolean>({
    cmd: 'saveSyncFolder',
    data: syncFolder,
  });
}
