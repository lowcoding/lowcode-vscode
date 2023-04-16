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
    path.join(snippetPath, 'script', 'index.js'),
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
