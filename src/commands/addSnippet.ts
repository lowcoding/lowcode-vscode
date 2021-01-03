import * as vscode from 'vscode';
import { getClipboardText, getSelectedText } from '../lib';
import { WebView } from './createOrShowWebview';
export const createOrShowWebview = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand('yapi-code.addSnippet', () => {
      WebView.createOrShow(context.extensionPath);
      const content = getSelectedText() || getClipboardText();
      WebView.pushTask({
        task: 'addSnippets',
        data: { content: content },
      });
    }),
  );
};
