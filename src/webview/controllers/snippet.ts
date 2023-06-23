import * as fs from 'fs-extra';
import * as path from 'path';
import { pasteToEditor } from '../../utils/editor';
import { snippetMaterialsPath } from '../../utils/vscodeEnv';
import { IMessage } from '../type';

export const insertSnippet = (message: IMessage<{ template: string }>) => {
  pasteToEditor(message.data.template);
};

export const addSnippets = (
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
  const snippetPath = path.join(snippetMaterialsPath, message.data.name);
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
  fs.outputFileSync(
    path.join(snippetPath, 'config', 'commandPrompt.ejs'),
    message.data.commandPrompt,
  );
  fs.outputFileSync(
    path.join(snippetPath, 'config', 'viewPrompt.ejs'),
    message.data.viewPrompt,
  );
  fs.outputFileSync(
    path.join(snippetPath, 'script', 'index.js'),
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
  return '添加成功';
};
