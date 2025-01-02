import vscode from 'vscode';
import { commands } from '../utils/env';
import { hideChatGPTView, showChatGPTView, showWebView } from '../webview';

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
    vscode.commands.registerCommand(commands.openDownloadMaterials, () => {
      showWebView({
        key: 'downloadMaterials',
        title: '下载物料',
        viewColumn: vscode.ViewColumn.One,
        task: { task: 'route', data: { path: '/downloadMaterials' } },
      });
    }),
  );
};
