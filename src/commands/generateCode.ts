import * as vscode from 'vscode';
import { getClipboardText, isYapiId, jsonIsValid } from '../lib';
import { genCodeByYapi } from '../genCode/genCodeByYapi';
import { genCodeByJson } from '../genCode/genCodeByJson';

const { window } = vscode;

export const generateCode = () => {
  return vscode.commands.registerTextEditorCommand(
    'yapi-code.generateCode',
    async () => {
      const clipboardText = getClipboardText().trim();

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
