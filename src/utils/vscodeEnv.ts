import * as path from 'path';
import { workspace } from 'vscode';

export const rootPath = path.join(workspace.rootPath || '');

export const materialsPath = path.join(workspace.rootPath || '', 'materials');

export const blockMaterialsPath = path.join(
  workspace.rootPath || '',
  'materials',
  'blocks',
);

export const snippetMaterialsPath = path.join(
  workspace.rootPath || '',
  'materials',
  'snippets',
);

export const checkRootPath = () => {
  if (!workspace.rootPath) {
    throw new Error('请打开工作目录');
  }
};
