import * as fs from 'fs-extra';
import * as path from 'path';
import { blockMaterialsPath } from '../../utils/vscodeEnv';
import { IMessage } from '../type';
import { getSyncFolder } from '../../utils/config';

export const createBlock = (
  message: IMessage<{
    name: string;
    template: string;
    model: string;
    schema: string;
    preview: string;
    commandPrompt: string;
    viewPrompt: string;
    private?: boolean;
  }>,
) => {
  let blockPath = path.join(blockMaterialsPath, message.data.name);
  if (message.data.private) {
    const syncFolder = getSyncFolder();
    if (!syncFolder) {
      return { code: 404, msg: '私有目录未配置', result: false };
    }
    blockPath = path.join(syncFolder, 'materials', 'blocks', message.data.name);
  }
  if (fs.existsSync(blockPath)) {
    throw new Error('区块名称已经存在');
  }
  fs.outputFileSync(
    path.join(blockPath, 'src', 'README.md'),
    message.data.template,
  );
  fs.outputFileSync(
    path.join(blockPath, 'config', 'model.json'),
    message.data.model,
  );
  fs.outputFileSync(
    path.join(blockPath, 'config', 'schema.json'),
    message.data.schema,
  );
  fs.outputFileSync(
    path.join(blockPath, 'config', 'preview.json'),
    message.data.preview,
  );
  fs.outputFileSync(
    path.join(blockPath, 'config', 'commandPrompt.ejs'),
    message.data.commandPrompt,
  );
  fs.outputFileSync(
    path.join(blockPath, 'config', 'viewPrompt.ejs'),
    message.data.viewPrompt,
  );
  fs.outputFileSync(
    path.join(blockPath, 'script', 'index.js'),
    `const path = require("path");
module.exports = {
  beforeCompile: (context) => {
		context.outputChannel.appendLine("compile ${message.data.name} start");
	},
	afterCompile: (context) => {
		context.outputChannel.appendLine("compile ${message.data.name} end");
	},
	test: (context) => {
		context.outputChannel.appendLine(Object.keys(context))
		context.outputChannel.appendLine(JSON.stringify(context.model))
		context.outputChannel.appendLine(context.params)
		return { ...context.model, name: "测试一下", }
	},
};`,
  );
  return { code: 200, msg: '私有目录未配置', result: false };
};
