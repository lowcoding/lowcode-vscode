import * as vscode from 'vscode';
export const CommonCommands = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('lowcode.openFolderForceNewWindow', () => {
      vscode.commands.executeCommand('vscode.openFolder', false, true);
    }),
  );
};
