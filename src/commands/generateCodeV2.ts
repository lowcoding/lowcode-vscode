import * as vscode from 'vscode';
import { getSnippets } from '../utils/materials';

const { window } = vscode;

export const registerGenerateCodeV2 = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      'lowcode.generateCodeV2',
      async () => {
        const templateList = getSnippets().filter(
          (s) => !s.preview.notShowInCommand,
        );
        if (templateList.length === 0) {
          window.showErrorMessage('请配置模板(代码片段)');
        }
        const templateResult = await window.showQuickPick(
          templateList.map((s) => s.name),
          { placeHolder: '请选择模板' },
        );
        if (!templateResult) {
          return;
        }
        const template = templateList.find((s) => s.name === templateResult);
        if (template?.privateMaterials) {
        }
      },
    ),
  );
};
