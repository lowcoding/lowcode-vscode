import { WebviewPanel, window, workspace } from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as dirTree from 'directory-tree';
import { getDomain, getLocalMaterials, getProjectList } from './config';
import { genTemplateModelByYapi } from './genCode/genCodeByYapi';
import { renderEjsTemplates, compile as compileEjs } from './compiler/ejs';
import { pasteToMarker } from './lib';

interface IMessage<T = any> {
  cmd: string;
  cbid: string;
  data: T;
}

function invokeCallback<T = any>(panel: WebviewPanel, cbid: string, res: T) {
  panel.webview.postMessage({
    cmd: 'vscodeCallback',
    cbid: cbid,
    data: res,
    code: 200,
  });
}

function invokeErrorCallback(
  panel: WebviewPanel,
  cbid: string,
  res: { title: string; message: string },
) {
  panel.webview.postMessage({
    cmd: 'vscodeCallback',
    cbid: cbid,
    data: res,
    code: 400,
  });
}

const messageHandler: {
  [propName: string]: (pandel: WebviewPanel, message: IMessage) => void;
} = {
  alert(pandel: WebviewPanel, message: IMessage) {
    console.log(
      JSON.stringify(window.visibleTextEditors.map((s: any) => s.id)),
    );
    window.showErrorMessage(message.data);
    invokeCallback(pandel, message.cbid, '来自vscode的回复');
  },
  getDirectoryTree(pandel: WebviewPanel, message: IMessage) {
    const filteredTree = dirTree(workspace.rootPath!, {
      exclude: /node_modules|\.umi|\.git/,
    });
    invokeCallback(pandel, message.cbid, filteredTree);
  },
  getLocalMaterials(
    pandel: WebviewPanel,
    message: IMessage<'blocks' | 'snippets'>,
  ) {
    const materials = getLocalMaterials(message.data);
    invokeCallback(pandel, message.cbid, materials);
  },
  getYapiDomain(pandel: WebviewPanel, message: IMessage) {
    const domian = getDomain();
    invokeCallback(pandel, message.cbid, domian);
  },
  getYapiProjects(pandel: WebviewPanel, message: IMessage) {
    const projects = getProjectList();
    invokeCallback(pandel, message.cbid, projects);
  },
  async genTemplateModelByYapi(
    pandel: WebviewPanel,
    message: IMessage<{
      domain: string;
      id: string;
      token: string;
      typeName?: string;
      funName?: string;
    }>,
  ) {
    try {
      const model = await genTemplateModelByYapi(
        message.data.domain,
        message.data.id,
        message.data.token,
        message.data.typeName,
        message.data.funName,
      );
      console.log(model);
      invokeCallback(pandel, message.cbid, model);
    } catch {
      invokeCallback(pandel, message.cbid, {});
    }
  },
  async genCodeByBlockMaterial(
    pandel: WebviewPanel,
    message: IMessage<{
      material: string;
      model: object;
      path: string;
      createPath: string[];
    }>,
  ) {
    try {
      const materialsPath = path.join(
        workspace.rootPath!,
        'materials/blocks',
        message.data.material,
      );
      const tempWordDir = path.join(workspace.rootPath!, '.lowcode');
      fs.copySync(materialsPath, tempWordDir);
      await renderEjsTemplates(message.data.model, tempWordDir);
      fs.copySync(
        path.join(tempWordDir, 'src'),
        path.join(message.data.path, ...message.data.createPath),
      );
      fs.removeSync(tempWordDir);
      invokeCallback(pandel, message.cbid, '成功');
    } catch (ex) {
      invokeErrorCallback(pandel, message.cbid, {
        title: '生成失败',
        message: ex.toString(),
      });
    }
  },
  async genCodeBySnippetMaterial(
    pandel: WebviewPanel,
    message: IMessage<{ model: any; template: string }>,
  ) {
    try {
      const code = compileEjs(message.data.template, message.data.model);
      pasteToMarker(code);
      invokeCallback(pandel, message.cbid, code);
    } catch (ex) {
      invokeErrorCallback(pandel, message.cbid, {
        title: '生成失败',
        message: ex.toString(),
      });
    }
  },
};

export default messageHandler;
