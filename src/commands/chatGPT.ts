import * as vscode from 'vscode';
import { commands } from '../utils/env';
import { hideChatGPTView, showChatGPTView } from '../webview';
import { getClipboardText, getSelectedText } from '../utils/editor';
import { getSnippets } from '../utils/materials';
import { compile as compileEjs, Model } from '../utils/ejs';

export const registerChatGPTCommand = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand(commands.showChatGPTView, () => {
      showChatGPTView();
    }),
    vscode.commands.registerCommand(commands.hideChatGPTView, () => {
      hideChatGPTView();
    }),
    vscode.commands.registerCommand('lowcode.openSettingsChatGPT', () => {
      vscode.commands.executeCommand(
        'workbench.action.openSettings',
        'lowcode.chatGPT',
      );
    }),
    vscode.commands.registerCommand('lowcode.askChatGPT', () => {
      showChatGPTView({
        task: {
          task: 'askChatGPT',
          data: getSelectedText() || getClipboardText(),
        },
      });
    }),
    vscode.commands.registerCommand(
      'lowcode.askChatGPTWithTemplate',
      async () => {
        const templateList = getSnippets().filter(
          (s) => s.preview.chatGPT && s.preview.chatGPT.commandPrompt,
        );
        if (templateList.length === 0) {
          vscode.window.showErrorMessage('请配置模板');
          return;
        }
        const templateResult = await vscode.window.showQuickPick(
          templateList.map((s) => s.name),
          { placeHolder: '请选择模板' },
        );
        if (!templateResult) {
          return;
        }
        const template = templateList.find((s) => s.name === templateResult);
        const model = {
          rawSelectedText: getSelectedText() || '',
          rawClipboardText: getClipboardText() || '',
        };
        const code = compileEjs(
          template!.preview.chatGPT?.commandPrompt!,
          model as Model,
        );
        showChatGPTView({
          task: { task: 'askChatGPT', data: code },
        });
      },
    ),
  );
};
