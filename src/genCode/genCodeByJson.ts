import { window } from 'vscode';
import { compile } from 'json-schema-to-typescript';
import { formatSchema } from '../lib';
import { compile as compileEjs } from '../compiler/ejs';
import { Model } from '../compiler/type';
import { getSnippets } from '../utils/materials';
import { getFuncNameAndTypeName, pasteToEditor } from '../utils/editor';

const GenerateSchema = require('generate-schema');
const strip = require('strip-comments');

export const genCodeByJson = async (
  jsonString: string,
  rawClipboardText: string,
) => {
  const templateList = getSnippets();
  if (templateList.length === 0) {
    window.showErrorMessage('请配置模板');
    return;
  }
  const selectInfo = getFuncNameAndTypeName();

  const templateResult = await window.showQuickPick(
    templateList.map((s) => s.name),
    { placeHolder: '请选择模板' },
  );
  if (!templateResult) {
    return;
  }
  const template = templateList.find((s) => s.name === templateResult);
  try {
    // const ts = await jsonToTs(selectInfo.typeName, jsonString);
    const json = JSON.parse(jsonString);
    const schema = GenerateSchema.json(selectInfo.typeName || 'Schema', json);
    let ts = await compile(schema, selectInfo.typeName, {
      bannerComment: undefined,
    });
    ts = strip(ts.replace(/(\[k: string\]: unknown;)|\?/g, ''));
    const { mockCode, mockData } = formatSchema(schema);
    const model: Model = {
      type: ts,
      funcName: selectInfo.funcName,
      typeName: selectInfo.typeName,
      inputValues: selectInfo.inputValues,
      mockCode,
      mockData,
      jsonData: json,
      jsonKeys: Object.keys(json),
      rawSelectedText: selectInfo.rawSelectedText,
      rawClipboardText,
    };
    const code = compileEjs(template!.template, model);
    pasteToEditor(code);
  } catch (e: any) {
    window.showErrorMessage(e.toString());
  }
};
