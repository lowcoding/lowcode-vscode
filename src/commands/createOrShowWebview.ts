import * as vscode from 'vscode';
import { showWebView } from '../webview';

export const createOrShowWebview = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'yapi-code.generateCodeByWebview',
      (args) => {
        let path: string = args ? args.path : '';
        if (
          path.startsWith('/') &&
          process.platform.toLowerCase().includes('win32')
        ) {
          path = path.substring(1);
        }
        showWebView({
          key: 'main',
          viewColumn: vscode.ViewColumn.Two,
          task: {
            task: 'updateSelectedFolder',
            data: { selectedFolder: path },
          },
        });
      },
    ),
  );
};
