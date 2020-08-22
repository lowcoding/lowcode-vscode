import * as vscode from 'vscode';
import { getClipboardText, isYapiId, jsonIsValid, jsonToTs } from '../lib';
import { genCodeByYapi } from '../genCode/genCodeByYapi';
import { genCodeByJson } from '../genCode/genCodeByJson';

const { window } = vscode;

export const generateCode = () => {
  return vscode.commands.registerTextEditorCommand(
    'yapi-code.generateCode',
    async () => {
      let clipboardText = getClipboardText().trim();
      let func: any = function () {
        return '';
      };
      if (
        clipboardText.startsWith('var') ||
        clipboardText.startsWith('let') ||
        clipboardText.startsWith('const')
      ) {
        clipboardText = clipboardText.replace(/(var|let|const).*=/, '');
      }
      try {
        func = new Function(`return ${clipboardText.trim()}`);
      } catch (ex) {}

      clipboardText = JSON.stringify(func());

      const validYapiId = isYapiId(clipboardText);

      const validJson = jsonIsValid(clipboardText);

      if (!validYapiId && !validJson) {
        window.showErrorMessage('请复制Yapi接口ID或JSON字符串');
        return;
      }

      if (validYapiId) {
        await genCodeByYapi(clipboardText);
      } else {
        await genCodeByJson(clipboardText);
      }
    },
  );
};
