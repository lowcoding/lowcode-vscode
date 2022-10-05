import * as path from 'path';
import { workspace } from 'vscode';

export const rootPath = path.join(workspace.rootPath || '');

export const tempWorkPath = path.join(rootPath, '.lowcode');

export const materialsPath = path.join(rootPath, 'materials');

export const blockMaterialsPath = path.join(rootPath, 'materials', 'blocks');

export const snippetMaterialsPath = path.join(
  rootPath,
  'materials',
  'snippets',
);

export const getEnv = () => ({
  rootPath,
  tempWorkPath,
  materialsPath,
  blockMaterialsPath,
  snippetMaterialsPath,
});

export const checkRootPath = () => {
  if (!rootPath) {
    throw new Error('请打开工作目录');
  }
};
