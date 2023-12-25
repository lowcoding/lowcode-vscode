import * as path from 'path';
import { workspace } from 'vscode';
import { getSyncFolder } from './config';

export const rootPath = path.join(workspace.rootPath || '');

export const tempWorkPath = path.join(rootPath, '.lowcode');

export const materialsPath = path.join(rootPath, 'materials');

export const blockMaterialsPath = path.join(rootPath, 'materials', 'blocks');

export const snippetMaterialsPath = path.join(
  rootPath,
  'materials',
  'snippets',
);

export const getPrivateBlockMaterialsPath = () => {
  const syncFolder = getSyncFolder();
  if (!syncFolder) {
    return '';
  }
  return path.join(syncFolder, 'materials', 'blocks');
};

export const getPrivateSnippetMaterialsPath = () => {
  const syncFolder = getSyncFolder();
  if (!syncFolder) {
    return '';
  }
  return path.join(syncFolder, 'materials', 'snippets');
};

export const getEnv = () => ({
  rootPath,
  tempWorkPath,
  materialsPath,
  blockMaterialsPath,
  snippetMaterialsPath,
  privateMaterialsPath: getSyncFolder(),
});

export const checkRootPath = () => {
  if (!rootPath) {
    throw new Error('请打开工作目录');
  }
};
