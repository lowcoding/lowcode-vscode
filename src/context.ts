import { ExtensionContext, window } from 'vscode';

const data: {
  extensionContext?: ExtensionContext;
  rootPath: string;
  extensionPath: string;
  activeTextEditorId: string;
} = {
  extensionContext: undefined, // 插件 context
  rootPath: '', // 工作空间根目录
  extensionPath: '', // 插件安装目录
  activeTextEditorId: '', // 激活的 tab id
};
export const setExtensionContext = (extensionContext: ExtensionContext) => {
  data.extensionContext = extensionContext;
};

export const getExtensionContext = () => {
  return data.extensionContext;
};

export const getRootPath = () => {
  return data.rootPath;
};

export const setRootPath = (rootPath: string) => {
  data.rootPath = rootPath;
};

export const setExtensionPath = (extensionPath: string) => {
  data.extensionPath = extensionPath;
};

export const setLastActiveTextEditorId = (activeTextEditorId: string) => {
  data.activeTextEditorId = activeTextEditorId;
};

export const getLastAcitveTextEditor = () => {
  const { visibleTextEditors } = window;
  const activeTextEditor = visibleTextEditors.find(
    (item: any) => item.id === data.activeTextEditorId,
  );
  return window.activeTextEditor || activeTextEditor;
};

export const getExtensionPath = () => {
  return data.extensionPath;
};

export const init = (options: {
  extensionContext?: ExtensionContext;
  rootPath?: string;
  extensionPath?: string;
}) => {
  if (options.rootPath) {
    data.rootPath = options.rootPath;
  }
  if (options.extensionPath) {
    data.extensionPath = options.extensionPath;
  }
  if (options.extensionContext) {
    data.extensionContext = options.extensionContext;
  }
};
