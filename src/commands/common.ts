import * as vscode from 'vscode';
import { WebView } from './createOrShowWebview';
export const CommonCommands = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('lowcode.openFolderForceNewWindow', () => {
      vscode.commands.executeCommand('_files.pickFolderAndOpen', {
        forceNewWindow: true,
      });
    }),
    vscode.commands.registerCommand('lowcode.openScaffold', () => {
      WebView.createOrShow(context.extensionPath);
      WebView.pushTask({
        task: 'route',
        data: { path: '/scaffold' },
      });
    }),
    vscode.commands.registerCommand('lowcode.openConfig', () => {
      WebView.createOrShow(context.extensionPath);
      WebView.pushTask({
        task: 'route',
        data: { path: '/config' },
      });
    }),
  );
};
