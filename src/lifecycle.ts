import * as path from 'path';
import * as fs from 'fs-extra';
import { window, ExtensionContext } from 'vscode';
import { getSnippets } from './utils/materials';
import { getEnv, rootPath } from './utils/vscodeEnv';

export const runActivate = (extensionContext: ExtensionContext) => {
  const templateList = getSnippets().filter((s) => s.preview.runActivate);
  templateList.forEach((template) => {
    const scriptFile = path.join(template!.path, 'script/index.js');
    if (fs.existsSync(scriptFile)) {
      // delete eval('require').cache[eval('require').resolve(scriptFile)];
      const script = eval('require')(scriptFile);
      if (script.onActivate) {
        const context = {
          workspaceRootPath: rootPath,
          env: { ...getEnv(), extensionContext },
          materialPath: template!.path,
          code: '',
        };
        try {
          script.onActivate(context);
        } catch (ex: any) {
          window.showErrorMessage(`${template.name}：${ex.toString()}`);
        }
      }
    }
  });
};
