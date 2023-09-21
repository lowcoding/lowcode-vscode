/* eslint-disable no-eval */
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { IMessage } from '../type';
import { getEnv, rootPath } from '../../utils/vscodeEnv';
import { getInnerLibs } from '../../utils/lib';
import { getOutputChannel } from '../../utils/outputChannel';
import { createChatCompletionForScript } from '../../utils/openai';

export const runScript = async (
  message: IMessage<{
    materialPath: string;
    createBlockPath?: string;
    script: string;
    params: string;
    model: object;
  }>,
) => {
  const scriptFile = path.join(message.data.materialPath, 'script/index.js');
  if (fs.existsSync(scriptFile)) {
    delete eval('require').cache[eval('require').resolve(scriptFile)];
    const script = eval('require')(scriptFile);
    if (script[message.data.script]) {
      const context = {
        model: message.data.model,
        params: message.data.params,
        vscode,
        workspaceRootPath: rootPath,
        env: getEnv(),
        libs: getInnerLibs(),
        outputChannel: getOutputChannel(),
        log: getOutputChannel(),
        createBlockPath: message.data.createBlockPath,
        createChatCompletion: createChatCompletionForScript,
        materialPath: message.data.materialPath,
      };
      const extendModel = await script[message.data.script](context);
      return extendModel;
    }
    throw new Error(`方法: ${message.data.script} 不存在`);
  } else {
    throw new Error(`脚本文件不存在`);
  }
};
