/* eslint-disable no-eval */
import vscode from 'vscode';
import path from 'path';
import fs from 'fs-extra';
import { IMessage } from '../type';
import { getEnv, rootPath } from '../../utils/vscodeEnv';
import { getInnerLibs } from '../../utils/lib';
import { getOutputChannel } from '../../utils/outputChannel';
import { createChatCompletionForScript } from '../../utils/llm';
import { getLastActiveTextEditor } from '../../context';

export const runScript = async (
  message: IMessage<{
    materialPath: string;
    createBlockPath?: string;
    script: string;
    params: string;
    clipboardImage?: string;
    model: object;
  }>,
) => {
  const scriptFile = path.join(message.data.materialPath, 'script/index.js');
  if (fs.existsSync(scriptFile)) {
    delete eval('require').cache[eval('require').resolve(scriptFile)];
    const script = eval('require')(scriptFile);
    if (script[message.data.script] || script.runScript) {
      const context = {
        model: message.data.model,
        method: message.data.script,
        script: message.data.script,
        params: message.data.params,
        clipboardImage: message.data.clipboardImage,
        vscode,
        workspaceRootPath: rootPath,
        env: getEnv(),
        libs: getInnerLibs(),
        outputChannel: getOutputChannel(),
        log: getOutputChannel(),
        createBlockPath: message.data.createBlockPath,
        createChatCompletion: createChatCompletionForScript,
        materialPath: message.data.materialPath,
        activeTextEditor: getLastActiveTextEditor(),
      };
      const extendModel = await (
        script[message.data.script] || script.runScript
      )(context);
      return extendModel;
    }
    throw new Error(`方法: ${message.data.script} 不存在`);
  } else {
    throw new Error(`脚本文件不存在`);
  }
};
