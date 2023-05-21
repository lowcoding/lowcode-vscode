import * as path from 'path';
import * as os from 'os';

export const commands = {
  openDownloadMaterials: 'lowcode.openDownloadMaterials',
  showChatGPTView: 'lowcode.showChatGPTView',
  hideChatGPTView: 'lowcode.hideChatGPTView',
  clearChatGPTViewContent: 'lowcode.clearChatGPTViewContent',
};

export const materialsDir = 'materials';

export const tempDir = {
  temp: path.join(os.homedir(), '.lowcode'),
  materials: path.join(os.homedir(), '.lowcode', 'materials'),
  blockMaterials: path.join(
    os.homedir(),
    '.lowcode',
    'materials',
    materialsDir,
    'blocks',
  ),
  snippetMaterials: path.join(
    os.homedir(),
    '.lowcode',
    'materials',
    materialsDir,
    'snippets',
  ),
  scaffold: path.join(os.homedir(), '.lowcode', 'scaffold'),
};
