import { getLocalMaterials, getSnippets } from '../../config';
import { IMessage } from '../type';

const material = {
  getLocalMaterials: (message: IMessage<'blocks' | 'snippets'>) => {
    if (message.data === 'blocks') {
      const materials = getLocalMaterials(message.data);
      return materials;
    }
    const materials = getSnippets();
    return materials;
  },
};

export default material;
