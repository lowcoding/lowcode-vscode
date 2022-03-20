import { commands, Uri, WebviewPanel, workspace } from 'vscode';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as dirTree from 'directory-tree';
import { compile } from 'json-schema-to-typescript';
import {
  getAllConfig,
  getDomain,
  getProjectList,
  saveAllConfig,
} from '../config';
import { genTemplateModelByYapi } from '../genCode/genCodeByYapi';
import { renderEjsTemplates, compile as compileEjs } from '../compiler/ejs';
import {
  compileScaffold,
  downloadScaffoldFromGit,
  pasteToMarker,
  selectDirectory,
} from '../lib';
import { registerCompletion } from '../commands/registerCompletion';
import { fetchScaffolds } from '../service';
import { getExtensionContext } from '../context';

const GenerateSchema = require('generate-schema');
const strip = require('strip-comments');

interface IMessage<T = any> {
  cmd: string;
  cbid: string;
  data: T;
}

export function invokeCallback<T = any>(
  panel: WebviewPanel,
  cbid: string,
  res: T,
) {
  panel.webview.postMessage({
    cmd: 'vscodeCallback',
    cbid,
    data: res,
    code: 200,
  });
}

export function invokeErrorCallback(
  panel: WebviewPanel,
  cbid: string,
  res: { title: string; message: string },
) {
  panel.webview.postMessage({
    cmd: 'vscodeCallback',
    cbid,
    data: res,
    code: 400,
  });
}

const messageHandler: {
  [propName: string]: (panel: WebviewPanel, message: IMessage) => void;
} = {
  getDirectoryTree(panel: WebviewPanel, message: IMessage) {
    const filteredTree = dirTree(workspace.rootPath!, {
      exclude: /node_modules|\.umi|\.git/,
    });
    invokeCallback(panel, message.cbid, filteredTree);
  },
  getYapiDomain(panel: WebviewPanel, message: IMessage) {
    const domian = getDomain();
    invokeCallback(panel, message.cbid, domian);
  },
  getYapiProjects(panel: WebviewPanel, message: IMessage) {
    const projects = getProjectList();
    invokeCallback(panel, message.cbid, projects);
  },
  async genTemplateModelByYapi(
    panel: WebviewPanel,
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
      invokeCallback(panel, message.cbid, model);
    } catch (ex: any) {
      invokeErrorCallback(panel, message.cbid, {
        title: '失败',
        message: ex.toString(),
      });
    }
  },
  async genCodeByBlockMaterial(
    panel: WebviewPanel,
    message: IMessage<{
      material: string;
      model: object;
      path: string;
      createPath: string[];
    }>,
  ) {
    const tempWordDir = path.join(workspace.rootPath!, '.lowcode');
    try {
      const materialsPath = path.join(
        workspace.rootPath!,
        'materials/blocks',
        message.data.material,
      );
      const schemaFile = path.join(materialsPath, 'config/schema.json');
      const schama = fs.readJSONSync(schemaFile);
      fs.copySync(materialsPath, tempWordDir);
      let excludeCompile: string[] = [];
      if (schama.excludeCompile) {
        excludeCompile = schama.excludeCompile;
      }
      if (schama.conditionFiles) {
        Object.keys(message.data.model).map((key) => {
          if (
            schama.conditionFiles[key] &&
            schama.conditionFiles[key].value ===
              (message.data.model as any)[key] &&
            Array.isArray(schama.conditionFiles[key].exclude)
          ) {
            schama.conditionFiles[key].exclude.map((exclude: string) => {
              fs.removeSync(path.join(tempWordDir, 'src', exclude));
              fs.removeSync(path.join(tempWordDir, exclude));
            });
          }
        });
      }
      const scriptFile = path.join(tempWordDir, 'script/index.js');
      const hook = {
        beforeCompile: (context: any) =>
          <object | undefined>Promise.resolve(undefined),
        afterCompile: (context: any) =>
          <object | undefined>Promise.resolve(undefined),
      };
      if (fs.existsSync(scriptFile)) {
        delete require.cache[require.resolve(scriptFile)];
        const script = require(scriptFile);
        if (script.beforeCompile) {
          hook.beforeCompile = script.beforeCompile;
        }
        if (script.afterCompile) {
          hook.afterCompile = script.afterCompile;
        }
      }
      const context = {
        model: message.data.model,
        vscode,
        workspaceRootPath: workspace.rootPath,
      };
      const extendModel = await hook.beforeCompile(context);
      if (extendModel) {
        message.data.model = {
          ...message.data.model,
          ...extendModel,
        };
      }
      await renderEjsTemplates(message.data.model, tempWordDir, excludeCompile);
      await hook.afterCompile(context);
      fs.copySync(
        path.join(tempWordDir, 'src'),
        path.join(message.data.path, ...message.data.createPath),
      );
      fs.removeSync(tempWordDir);
      invokeCallback(panel, message.cbid, '成功');
    } catch (ex: any) {
      fs.remove(tempWordDir);
      invokeErrorCallback(panel, message.cbid, {
        title: '生成失败',
        message: ex.toString(),
      });
    }
  },
  async genCodeBySnippetMaterial(
    panel: WebviewPanel,
    message: IMessage<{ model: any; template: string; name: string }>,
  ) {
    try {
      const snippetPath = path.join(
        workspace.rootPath!,
        'materials/snippets',
        message.data.name,
      );
      const scriptFile = path.join(snippetPath, 'script/index.js');
      const hook = {
        beforeCompile: (context: any) =>
          <object | undefined>Promise.resolve(undefined),
        afterCompile: (context: any) => <any>Promise.resolve(undefined),
      };
      if (fs.existsSync(scriptFile)) {
        delete require.cache[require.resolve(scriptFile)];
        const script = require(scriptFile);
        if (script.beforeCompile) {
          hook.beforeCompile = script.beforeCompile;
        }
        if (script.afterCompile) {
          hook.afterCompile = script.afterCompile;
        }
      }
      const context = {
        model: message.data.model,
        vscode,
        workspaceRootPath: workspace.rootPath,
        code: '',
      };
      const extendModel = await hook.beforeCompile(context);
      if (extendModel) {
        message.data.model = {
          ...message.data.model,
          ...extendModel,
        };
      }
      const code = compileEjs(message.data.template, message.data.model);
      context.code = code;
      const newCode = await hook.afterCompile(context);
      pasteToMarker(newCode || code);
      invokeCallback(panel, message.cbid, newCode || code);
    } catch (ex: any) {
      invokeErrorCallback(panel, message.cbid, {
        title: '生成失败',
        message: ex.toString(),
      });
    }
  },
  insertSnippet(panel: WebviewPanel, message: IMessage<{ template: string }>) {
    try {
      pasteToMarker(message.data.template);
    } catch (ex: any) {
      invokeErrorCallback(panel, message.cbid, {
        title: '添加失败',
        message: ex.toString(),
      });
    }
  },
  addSnippets(
    panel: WebviewPanel,
    message: IMessage<{
      name: string;
      template: string;
      model: string;
      schema: string;
      preview: string;
    }>,
  ) {
    const snippetPath = path.join(
      workspace.rootPath!,
      'materials',
      'snippets',
      message.data.name,
    );
    try {
      fs.outputFileSync(
        path.join(snippetPath, 'src', 'template.ejs'),
        message.data.template,
      );
      fs.outputFileSync(
        path.join(snippetPath, 'config', 'model.json'),
        message.data.model,
      );
      fs.outputFileSync(
        path.join(snippetPath, 'config', 'schema.json'),
        message.data.schema,
      );
      fs.outputFileSync(
        path.join(snippetPath, 'config', 'preview.json'),
        message.data.preview,
      );
      invokeCallback(panel, message.cbid, '添加成功');
    } catch (ex: any) {
      invokeErrorCallback(panel, message.cbid, {
        title: '添加失败',
        message: ex.toString(),
      });
    }
  },
  async jsonToTs(
    panel: WebviewPanel,
    message: IMessage<{ json: object; typeName: string }>,
  ) {
    try {
      const schema = GenerateSchema.json(
        message.data.typeName || 'DefaultType',
        message.data.json,
      );
      let ts = await compile(schema, message.data.typeName, {
        bannerComment: undefined,
      });
      ts = strip(ts.replace(/(\[k: string\]: unknown;)|\?/g, ''));
      invokeCallback(panel, message.cbid, ts);
    } catch (ex: any) {
      invokeErrorCallback(panel, message.cbid, {
        title: '生成失败',
        message: ex.toString(),
      });
    }
  },
  getPluginConfig(panel: WebviewPanel, message: IMessage) {
    try {
      invokeCallback(panel, message.cbid, getAllConfig());
    } catch (ex: any) {
      invokeErrorCallback(panel, message.cbid, {
        title: '读取配置失败',
        message: ex.toString(),
      });
    }
  },
  savePluginConfig(
    panel: WebviewPanel,
    message: IMessage<{
      yapi: {
        domain: string;
        projects: {
          name: string;
          token: string;
          domain: string;
        }[];
      };
      mock: {
        mockNumber: string;
        mockBoolean: string;
        mockString: string;
        mockKeyWordEqual: {
          key: string;
          value: string;
        }[];
        mockKeyWordLike: {
          key: string;
          value: string;
        }[];
      };
      saveOption: ['vscode', 'package'];
    }>,
  ) {
    const mockKeyWordEqual = {} as any;
    message.data.mock.mockKeyWordEqual.map((s) => {
      mockKeyWordEqual[s.key] = s.value;
    });
    const mockKeyWordLike = {} as any;
    message.data.mock.mockKeyWordLike.map((s) => {
      mockKeyWordLike[s.key] = s.value;
    });
    if (message.data.saveOption.includes('vscode')) {
      try {
        saveAllConfig({
          yapi: { ...message.data.yapi },
          mock: { ...message.data.mock, mockKeyWordEqual, mockKeyWordLike },
        });
      } catch (ex: any) {
        invokeErrorCallback(panel, message.cbid, {
          title: '保存失败',
          message: ex.toString(),
        });
        return;
      }
    }
    if (message.data.saveOption.includes('package')) {
      try {
        const packageObj = fs.readJsonSync(
          path.join(workspace.rootPath!, 'package.json'),
        );
        const newPackageObj = {
          ...packageObj,
          'yapi-code.domain': message.data.yapi.domain,
          'yapi-code.project': message.data.yapi.projects,
          'yapi-code.mockNumber': message.data.mock.mockNumber,
          'yapi-code.mockBoolean': message.data.mock.mockBoolean,
          'yapi-code.mockString': message.data.mock.mockString,
          'yapi-code.mockKeyWordEqual': mockKeyWordEqual,
          'yapi-code.mockKeyWordLike': mockKeyWordLike,
        };
        fs.writeFileSync(
          path.join(workspace.rootPath!, 'package.json'),
          JSON.stringify(newPackageObj, null, 2),
        );
      } catch (ex: any) {
        invokeErrorCallback(panel, message.cbid, {
          title: '保存失败',
          message: ex.toString(),
        });
        return;
      }
    }
    invokeCallback(panel, message.cbid, '保存成功');
  },
  refreshIntelliSense(panel: WebviewPanel, message: IMessage) {
    const context = getExtensionContext();
    if (context) {
      registerCompletion(context);
      invokeCallback(panel, message.cbid, '刷新成功');
    } else {
      invokeErrorCallback(panel, message.cbid, {
        title: '刷新失败',
        message: '',
      });
    }
  },
  getScaffolds(panel: WebviewPanel, message: IMessage<{ url: string }>) {
    fetchScaffolds(message.data.url)
      .then((res) => {
        invokeCallback(panel, message.cbid, res.data);
      })
      .catch((ex: any) => {
        invokeErrorCallback(panel, message.cbid, {
          title: '请求失败',
          message: ex.toString(),
        });
      });
  },
  downloadScaffold(
    panel: WebviewPanel,
    message: IMessage<{
      type: 'git' | 'npm';
      repository: string;
    }>,
  ) {
    if (message.data.type === 'git') {
      try {
        const config = downloadScaffoldFromGit(message.data.repository);
        invokeCallback(panel, message.cbid, config);
      } catch (ex: any) {
        invokeErrorCallback(panel, message.cbid, {
          title: '发生异常',
          message: ex.toString(),
        });
      }
    }
  },
  selectDirectory(panel: WebviewPanel, message: IMessage) {
    selectDirectory()
      .then((dir) => {
        invokeCallback(panel, message.cbid, dir);
      })
      .catch((ex: any) => {
        invokeErrorCallback(panel, message.cbid, {
          title: '发生异常',
          message: ex.toString(),
        });
      });
  },
  async createProject(
    panel: WebviewPanel,
    message: IMessage<{
      model: any;
      createDir: string;
      immediateOpen: boolean;
    }>,
  ) {
    try {
      await compileScaffold(message.data.model, message.data.createDir);
      invokeCallback(panel, message.cbid, '创建项目成功');
      if (message.data.immediateOpen) {
        commands.executeCommand(
          'vscode.openFolder',
          Uri.file(message.data.createDir),
          true,
        );
      }
    } catch (ex: any) {
      invokeErrorCallback(panel, message.cbid, {
        title: '发生异常',
        message: ex.toString(),
      });
    }
  },
};

export default messageHandler;
