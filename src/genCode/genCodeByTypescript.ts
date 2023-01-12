import { window } from 'vscode';
import { compile as compileEjs, Model } from '../utils/ejs';
import { getSnippets } from '../utils/materials';
import { getFuncNameAndTypeName, pasteToEditor } from '../utils/editor';
import { typescriptToJson } from '../utils/json';

export const genCodeByTypescript = async (
  typeString: string,
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
    { placeHolder: '请选择TS相关模板' },
  );
  if (!templateResult) {
    return;
  }
  const template = templateList.find((s) => s.name === templateResult);
  const { mockCode, mockData } = typescriptToJson(typeString);
  const model: Model = {
    type: '',
    funcName: selectInfo.funcName,
    typeName: selectInfo.typeName,
    inputValues: selectInfo.inputValues,
    mockCode,
    mockData,
    jsonData: '',
    rawSelectedText: selectInfo.rawSelectedText,
    rawClipboardText,
  };
  const code = compileEjs(template!.template, model);
  pasteToEditor(code);
};
