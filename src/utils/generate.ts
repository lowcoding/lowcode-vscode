/* eslint-disable no-eval */
import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import {
  blockMaterialsPath,
  getEnv,
  rootPath,
  snippetMaterialsPath,
  tempWorkPath,
} from './vscodeEnv';
import { renderEjsTemplates, compile } from './ejs';
import { pasteToEditor } from './editor';
import { getFileContent } from './file';
import { getInnerLibs } from './lib';
import { getOutputChannel } from './outputChannel';

export const genCodeByBlock = async (data: {
  material: string;
  model: object;
  path: string;
  createPath: string[];
}) => {
  try {
    const materialsPath = path.join(blockMaterialsPath, data.material);
    const schemaFile = path.join(materialsPath, 'config/schema.json');
    const schama = fs.readJSONSync(schemaFile);
    fs.copySync(materialsPath, tempWorkPath);
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
    const scriptFile = path.join(tempWorkPath, 'script/index.js');
    const hook = {
      beforeCompile: (context: any) =>
        <object | undefined>Promise.resolve(undefined),
      afterCompile: (context: any) =>
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
    }
    const context = {
      model: data.model,
      vscode,
      workspaceRootPath: rootPath,
      env: getEnv(),
      libs: getInnerLibs(),
      outputChannel: getOutputChannel(),
    };
    const extendModel = await hook.beforeCompile(context);
    if (extendModel) {
      data.model = {
        ...data.model,
        ...extendModel,
      };
    }
    await renderEjsTemplates(data.model, tempWorkPath, excludeCompile);
    await hook.afterCompile(context);
    fs.copySync(
      path.join(tempWorkPath, 'src'),
      path.join(data.path, ...data.createPath),
    );
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
}) => {
  const snippetPath = path.join(snippetMaterialsPath, data.name);
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
  const context = {
    model: data.model,
    vscode,
    workspaceRootPath: rootPath,
    env: getEnv(),
    libs: getInnerLibs(),
    outputChannel: getOutputChannel(),
    code: '',
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
