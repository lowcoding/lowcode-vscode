import * as vscode from 'vscode';
import { generateCode } from './commands/generateCode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(generateCode());

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      'yapi-code.generateMockCode',
      () => {
        vscode.window.showInformationMessage('敬请期待');
      },
    ),
  );
}
export function deactivate() {}
