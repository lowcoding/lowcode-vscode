import * as vscode from 'vscode';

const { window } = vscode;

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace
    .getConfiguration()
    .update('yapi.domain', 'hahahahahahah', true);
  let disposable = vscode.commands.registerTextEditorCommand(
    'yapi-code.generateFetchFun',
    async () => {
      vscode.window.showInformationMessage(
        vscode.workspace.getConfiguration().get('yapi.domain', ''),
      );
      //   const result = await window.showInputBox({
      //     value: 'abcdef',
      //     valueSelection: [2, 4],
      //     placeHolder: 'For example: fedcba. But not: 123',
      //     validateInput: (text) => {
      //       window.showInformationMessage(`Validating: ${text}`);
      //       return text === '123' ? 'Not 123!' : null;
      //     },
      //   });
      //   window.showInformationMessage(`Got: ${result}`);
    },
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      'yapi-code.generateFetchFunByJSON',
      () => {},
    ),
  );
}
export function deactivate() {}
