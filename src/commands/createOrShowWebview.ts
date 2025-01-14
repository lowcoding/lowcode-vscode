import vscode from 'vscode';
import { formatPath } from '../utils/platform';
import { showWebView } from '../webview';

export const createOrShowWebview = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('lowcode.generateCodeByWebview', (args) => {
      const path = formatPath(args?.path);
      showWebView({
        key: 'main',
        viewColumn: vscode.ViewColumn.Two,
        task: path
          ? {
              task: 'updateSelectedFolder',
              data: { selectedFolder: path },
            }
          : undefined,
      });
    }),
  );
};
