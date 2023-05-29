import * as vscode from 'vscode';
import { commands } from '../utils/env';
import { hideChatGPTView, showChatGPTView } from '../webview';
import { getClipboardText, getSelectedText } from '../utils/editor';

export const registerChatGPTCommand = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand(commands.showChatGPTView, () => {
      showChatGPTView();
    }),
    vscode.commands.registerCommand(commands.hideChatGPTView, () => {
      hideChatGPTView();
    }),
    vscode.commands.registerCommand('lowcode.askChatGPT', () => {
      showChatGPTView({
        task: {
          task: 'askChatGPT',
          data: getSelectedText() || getClipboardText(),
        },
      });
    }),
    vscode.commands.registerCommand('lowcode.askChatGPTWithTemplate', () => {
      showChatGPTView({
        task: { task: 'askChatGPT', data: 'jkjkjkjkjkjkjkjk' },
      });
    }),
  );
};
