import * as vscode from 'vscode';
import { generateCode } from './commands/generateCode';
import { createOrShowWebview } from './commands/createOrShowWebview';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(generateCode());

  context.subscriptions.push(createOrShowWebview(context));
}
export function deactivate() {}
