import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { getSnippets } from '../utils/materials';
import { getEnv, rootPath } from '../utils/vscodeEnv';
import { getInnerLibs } from '../utils/lib';
import { getOutputChannel } from '../utils/outputChannel';
import { createChatCompletionForScript } from '../utils/openai';
import { getClipboardImage } from '../utils/clipboard';

const { window } = vscode;

export const registerRunSnippetScript = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      'lowcode.runSnippetScript',
      async () => {
        const templateList = getSnippets().filter(
          (s) => s.preview.showInRunSnippetScript,
        );
        if (templateList.length === 0) {
          window.showErrorMessage(
            '请配置模板（通过 showInRunSnippetScript 字段开启）',
          );
        }
        const templateResult = await window.showQuickPick(
          templateList.map((s) => s.name),
          { placeHolder: '请选择模板' },
        );
        if (!templateResult) {
          return;
        }
        const template = templateList.find((s) => s.name === templateResult);
        const scriptFile = path.join(template!.path, 'script/index.js');
        if (fs.existsSync(scriptFile)) {
          delete eval('require').cache[eval('require').resolve(scriptFile)];
          const script = eval('require')(scriptFile);
          if (script.onSelect) {
            const context = {
              vscode,
              workspaceRootPath: rootPath,
              env: getEnv(),
              libs: getInnerLibs(),
              outputChannel: getOutputChannel(),
              log: getOutputChannel(),
              createChatCompletion: createChatCompletionForScript,
              materialPath: template!.path,
              getClipboardImage,
              code: '',
            };
            try {
              await script.onSelect(context);
            } catch (ex: any) {
              window.showErrorMessage(ex.toString());
            }
          } else {
            window.showErrorMessage('脚本中未实现 onSelect 方法');
          }
        } else {
          window.showErrorMessage('当前模板中未添加脚本');
        }
      },
    ),
  );
};
