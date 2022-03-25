import { commands, ExtensionContext, window } from 'vscode';
import { getCommonlyUsedBlock } from '../config';
import { genCodeByBlockWithDefaultModel } from '../utils/generate';
import { formatPath } from '../utils/platform';

export const registerQuickGenerateBlock = (context: ExtensionContext) => {
  context.subscriptions.push(
    commands.registerCommand('lowcode.quickGenerateBlock', async (args) => {
      const path = formatPath(args.path);
      const blocks = getCommonlyUsedBlock();
      if (blocks.length < 1) {
        window.showWarningMessage('未配置常用区块', {
          modal: true,
        });
        return;
      }
      let block: undefined | string = '';
      if (blocks.length === 1) {
        block = blocks[0];
      } else {
        block = await window.showQuickPick(blocks, {
          placeHolder: '请选择区块',
        });
        if (!block) {
          return;
        }
      }
      try {
        await genCodeByBlockWithDefaultModel(path, block);
      } catch (ex: any) {
        window.showErrorMessage(ex.toString());
      }
    }),
  );
};
