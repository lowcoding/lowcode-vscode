import * as vscode from 'vscode';
const context: {
  instance?: vscode.ExtensionContext;
} = { instance: undefined };

export function setContext(instance: vscode.ExtensionContext) {
  context.instance = instance;
}

export function getContext() {
  return context.instance;
}
