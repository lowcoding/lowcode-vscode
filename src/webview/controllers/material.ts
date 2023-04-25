import {
  copyMaterialsFromTemp,
  downloadMaterialsFromGit,
  downloadMaterialsFromNpm,
} from '../../utils/download';
import { tempDir } from '../../utils/env';
import { getLocalMaterials, getSnippets } from '../../utils/materials';
import { blockMaterialsPath, materialsPath } from '../../utils/vscodeEnv';
import { IMessage } from '../type';

const material = {
  getLocalMaterials: (message: IMessage<'blocks' | 'snippets'>) => {
    if (message.data === 'blocks') {
      const materials = getLocalMaterials('blocks', blockMaterialsPath);
      return materials;
    }
    const materials = getSnippets().filter(
      (s) => !s.preview.notShowInSnippetsList,
    );
    return materials;
  },

  downloadMaterials: async (
    message: IMessage<{ type: 'git' | 'npm'; url: string }>,
  ) => {
    if (message.data.type === 'npm') {
      await downloadMaterialsFromNpm(message.data.url);
    } else {
      downloadMaterialsFromGit(message.data.url);
    }
    const materials = {
      blocks: getLocalMaterials('blocks', tempDir.blockMaterials),
      snippets: getLocalMaterials('snippets', tempDir.snippetMaterials),
    };
    return materials;
  },

  saveDownloadMaterials: async (
    message: IMessage<{ blocks: string[]; snippets: string[] }>,
  ) => {
    copyMaterialsFromTemp(message.data, materialsPath);
  },
};

export default material;
