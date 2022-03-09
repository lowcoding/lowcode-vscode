import * as vscode from 'vscode';
import { showWebView } from '../webview';

export const createOrShowWebview = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'yapi-code.generateCodeByWebview',
      (args) => {
        showWebView({
          key: 'main',
          viewColumn: vscode.ViewColumn.Two,
          task: {
            task: 'updateSelectedFolder',
            data: { selectedFolder: args ? args.path : '' },
          },
        });
      },
    ),
  );
};
