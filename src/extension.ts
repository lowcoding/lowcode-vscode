import * as vscode from 'vscode';
import { generateCode } from './commands/generateCode';
import { createOrShowWebview } from './commands/createOrShowWebview';
import { setLastActiveTextEditorId } from './lib';

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
  context.subscriptions.push(generateCode());

  context.subscriptions.push(createOrShowWebview(context));
}
export function deactivate() {}
