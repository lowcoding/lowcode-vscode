import * as vscode from 'vscode';
import { showWebView } from '../webview';

export const CommonCommands = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('lowcode.openFolderForceNewWindow', () => {
      vscode.commands.executeCommand('_files.pickFolderAndOpen', {
        forceNewWindow: true,
      });
    }),
    vscode.commands.registerCommand('lowcode.openScaffold', () => {
      showWebView({
        key: 'createApp',
        title: '创建应用',
        viewColumn: vscode.ViewColumn.One,
        task: { task: 'route', data: { path: '/scaffold' } },
      });
    }),
    vscode.commands.registerCommand('lowcode.openConfig', () => {
      showWebView({
        key: 'main',
        task: { task: 'route', data: { path: '/config' } },
      });
    }),
  );
};
