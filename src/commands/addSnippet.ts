import * as vscode from 'vscode';
import { getClipboardText, getSelectedText } from '../utils/editor';
import { showWebView } from '../webview';

export const createOrShowWebview = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand('lowcode.addSnippet', () => {
      const content = getSelectedText() || getClipboardText();
      showWebView({
        key: 'main',
        task: { task: 'addSnippets', data: { content } },
      });
    }),
    vscode.commands.registerCommand('lowcode.addPromptTemplate', () => {
      showWebView({
        key: 'main',
        task: { task: 'addSnippets' },
      });
    }),
  );
};
