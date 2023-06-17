import * as fs from 'fs-extra';
import * as path from 'path';
import { blockMaterialsPath } from '../../utils/vscodeEnv';
import { IMessage } from '../type';

export const createBlock = (
  message: IMessage<{
    name: string;
    template: string;
    model: string;
    schema: string;
    preview: string;
    commandPrompt: string;
    viewPrompt: string;
  }>,
) => {
  const blockPath = path.join(blockMaterialsPath, message.data.name);
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
  beforeCompile: (context) => {},
  afterCompile: (context) => {
    context.outputChannel.appendLine("compile ${message.data.name} end");
  },
};`,
  );
  return '添加成功';
};
