import dirTree from 'directory-tree';
import { rootPath } from '../../utils/vscodeEnv';

export const getDirectoryTree = () => {
  const filteredTree = dirTree(rootPath, {
    exclude: /node_modules|\.umi|\.git/,
  });
  return filteredTree;
};
