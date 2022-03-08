import * as vscode from 'vscode';
import { ViewColumn } from 'vscode';
import { getClipboardText, getSelectedText } from '../lib';
import { showWebView } from '../utils/webview';
import { WebView } from './createOrShowWebview';
export const createOrShowWebview = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand('yapi-code.addSnippet', () => {
      WebView.createOrShow(context.extensionPath);
      const content = getSelectedText() || getClipboardText();
      showWebView({
        key: 'Main',
        title: '1212',
        viewColumn: ViewColumn.One,
        task: { task: 'route', data: { path: '/scaffold' } },
      });
      WebView.pushTask({
        task: 'addSnippets',
        data: { content: content },
      });
    }),
  );
};
