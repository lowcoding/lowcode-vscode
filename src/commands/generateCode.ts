import * as vscode from 'vscode';
import { genCodeByYapi } from '../genCode/genCodeByYapi';
import { genCodeByJson } from '../genCode/genCodeByJson';
import { genCodeByTypescript } from '../genCode/genCodeByTypescript';
import { getClipboardText } from '../utils/editor';
import { isYapiId, jsonIsValid, jsonParse } from '../utils/json';

const { window } = vscode;

export const generateCode = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      'yapi-code.generateCode',
      async () => {
        const rawClipboardText = getClipboardText();
        let clipboardText = rawClipboardText.trim();

        clipboardText = JSON.stringify(jsonParse(clipboardText));

        const validYapiId = isYapiId(clipboardText);

        const validJson = jsonIsValid(clipboardText);

        const valid = validJson || validYapiId;
        if (valid) {
          if (validYapiId) {
            await genCodeByYapi(clipboardText, rawClipboardText);
          } else {
            await genCodeByJson(clipboardText, rawClipboardText);
          }
          return;
        }
        try {
          await genCodeByTypescript(rawClipboardText, rawClipboardText);
        } catch {
          window.showErrorMessage('请复制Yapi接口ID或JSON字符串或TS类型');
        }
      },
    ),
  );
};
