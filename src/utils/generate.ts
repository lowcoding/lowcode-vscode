/* eslint-disable no-eval */
import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import {
  blockMaterialsPath,
  getEnv,
  getPrivateBlockMaterialsPath,
  getPrivateSnippetMaterialsPath,
  rootPath,
  snippetMaterialsPath,
  tempWorkPath as defaultTempWorkPath,
} from './vscodeEnv';
import { renderEjsTemplates, compile } from './ejs';
import { pasteToEditor } from './editor';
import { getFileContent } from './file';
import { getInnerLibs } from './lib';
import { getOutputChannel } from './outputChannel';
import { getLastActiveTextEditor } from '../context';
import { getSyncFolder } from './config';
import { createChatCompletionForScript } from './openai';

export const genCodeByBlock = async (data: {
  material: string;
  model: object;
  path: string;
  createPath: string[];
  privateMaterials?: boolean;
}) => {
  let tempWorkPath = defaultTempWorkPath;
  if (data.privateMaterials) {
    tempWorkPath = path.join(getSyncFolder(), '.lowcode');
  }
  try {
    const block = path.join(
      data.privateMaterials
        ? getPrivateBlockMaterialsPath()
        : blockMaterialsPath,
      data.material,
    );
    const schemaFile = path.join(block, 'config/schema.json');
    const schama = fs.readJSONSync(schemaFile);
    fs.copySync(block, tempWorkPath);
    let excludeCompile: string[] = [];
    if (schama.excludeCompile) {
      excludeCompile = schama.excludeCompile;
    }
    if (schama.conditionFiles) {
      Object.keys(data.model).map((key) => {
        if (
          schama.conditionFiles[key] &&
          schama.conditionFiles[key].value === (data.model as any)[key] &&
          Array.isArray(schama.conditionFiles[key].exclude)
        ) {
          schama.conditionFiles[key].exclude.map((exclude: string) => {
            fs.removeSync(path.join(tempWorkPath, 'src', exclude));
            fs.removeSync(path.join(tempWorkPath, exclude));
          });
        }
      });
    }
    const scriptFile = path.join(block, 'script/index.js'); // 不能使用临时目录里的文件，会导致 ts-node 报错
    const hook = {
      beforeCompile: (context: any) =>
        <object | undefined>Promise.resolve(undefined),
      afterCompile: (context: any) =>
        <object | undefined>Promise.resolve(undefined),
      complete: (context: any) =>
        <object | undefined>Promise.resolve(undefined),
    };
    if (fs.existsSync(scriptFile)) {
      delete eval('require').cache[eval('require').resolve(scriptFile)];
      const script = eval('require')(scriptFile);
      if (script.beforeCompile) {
        hook.beforeCompile = script.beforeCompile;
      }
      if (script.afterCompile) {
        hook.afterCompile = script.afterCompile;
      }
      if (script.complete) {
        hook.complete = script.complete;
      }
    }
    const context = {
      model: data.model,
      vscode,
      workspaceRootPath: rootPath,
      env: getEnv(),
      libs: getInnerLibs(),
      outputChannel: getOutputChannel(),
      log: getOutputChannel(),
      createBlockPath: path
        .join(data.path, ...data.createPath)
        .replace(/\\/g, '/'),
      createChatCompletion: createChatCompletionForScript,
      materialPath: block,
      activeTextEditor: getLastActiveTextEditor(),
    };
    data.model = {
      ...data.model,
      createBlockPath: path
        .join(data.path, ...data.createPath)
        .replace(/\\/g, '/'),
    };
    const extendModel = await hook.beforeCompile(context);
    if (extendModel) {
      data.model = {
        ...data.model,
        ...extendModel,
      };
    }
    await renderEjsTemplates(
      data.model,
      path.join(tempWorkPath, 'src'),
      excludeCompile,
    );
    await hook.afterCompile(context);
    fs.copySync(
      path.join(tempWorkPath, 'src'),
      path.join(data.path, ...data.createPath),
    );
    await hook.complete(context);
    fs.removeSync(tempWorkPath);
  } catch (ex: any) {
    fs.remove(tempWorkPath);
    throw ex;
  }
};

export const genCodeByBlockWithDefaultModel = async (
  genPath: string,
  blockName: string,
) => {
  if (!fs.existsSync(path.join(blockMaterialsPath, blockName))) {
    throw new Error('区块不存在');
  }
  let model = {} as any;
  try {
    model = JSON.parse(
      getFileContent(
        path.join(blockMaterialsPath, blockName, 'config', 'model.json'),
        true,
      ),
    );
  } catch {}
  await genCodeByBlock({
    material: blockName,
    model,
    path: genPath,
    createPath: [],
  });
};

export const genCodeBySnippet = async (data: {
  model: any;
  template: string;
  name: string;
  privateMaterials?: boolean;
}) => {
  const snippetPath = path.join(
    data.privateMaterials
      ? getPrivateSnippetMaterialsPath()
      : snippetMaterialsPath,
    data.name,
  );
  const scriptFile = path.join(snippetPath, 'script/index.js');
  const hook = {
    beforeCompile: (context: any) =>
      <object | undefined>Promise.resolve(undefined),
    afterCompile: (context: any) => <any>Promise.resolve(undefined),
  };
  if (fs.existsSync(scriptFile)) {
    delete eval('require').cache[eval('require').resolve(scriptFile)];
    const script = eval('require')(scriptFile);
    if (script.beforeCompile) {
      hook.beforeCompile = script.beforeCompile;
    }
    if (script.afterCompile) {
      hook.afterCompile = script.afterCompile;
    }
  }
  const activeTextEditor = getLastActiveTextEditor();
  if (activeTextEditor) {
    data.model = {
      ...data.model,
      activeTextEditorFilePath: activeTextEditor.document.uri.fsPath.replace(
        /\\/g,
        '/',
      ),
    };
  }
  const context = {
    model: data.model,
    vscode,
    workspaceRootPath: rootPath,
    env: getEnv(),
    libs: getInnerLibs(),
    outputChannel: getOutputChannel(),
    log: getOutputChannel(),
    createChatCompletion: createChatCompletionForScript,
    materialPath: snippetPath,
    code: '',
    activeTextEditor: getLastActiveTextEditor(),
  };
  const extendModel = await hook.beforeCompile(context);
  if (extendModel) {
    data.model = {
      ...data.model,
      ...extendModel,
    };
  }
  const code = compile(data.template, data.model);
  context.code = code;
  const newCode = await hook.afterCompile(context);
  pasteToEditor(newCode || code);
};
