import * as vscode from 'vscode';
import { generateCode } from './commands/generateCode';
import { createOrShowWebview } from './commands/createOrShowWebview';
import { createOrShowWebview as createOrShowAddSnippetWebview } from './commands/addSnippet';
import { registerCompletion } from './commands/registerCompletion';
import { openSnippet } from './commands/openSnippet';
import { CommonCommands } from './commands/common';
import { init, setLastActiveTextEditorId } from './context';

export function activate(context: vscode.ExtensionContext) {
  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      if (editor) {
        const { id } = editor as any;
        setLastActiveTextEditorId(id);
      }
    },
    null,
    context.subscriptions,
  );

  init({ extensionContext: context, extensionPath: context.extensionPath });

  generateCode(context);

  createOrShowWebview(context);

  createOrShowAddSnippetWebview(context);

  registerCompletion(context);

  openSnippet(context);

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    -1,
  );
  statusBarItem.command = 'yapi-code.generateCodeByWebview';
  statusBarItem.text = '$(octoface) Low Code';
  statusBarItem.tooltip = '可视化生成代码';
  statusBarItem.show();

  CommonCommands(context);
}
export function deactivate() {}
