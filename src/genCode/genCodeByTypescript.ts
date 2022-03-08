import { window } from 'vscode';
import { getSnippets } from '../config';
import {
  getFuncNameAndTypeName,
  pasteToMarker,
  typescriptToJson,
} from '../lib';
import { compile as compileEjs } from '../compiler/ejs';
import { Model } from '../compiler/type';

export const genCodeByTypescript = async (
  typeString: string,
  rawClipboardText: string,
) => {
  // const templateList = getCodeTemplateList();
  //const templateList = getCodeTemplateListFromFiles();
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
      rawClipboardText: rawClipboardText,
    };
    const code = compileEjs(template!.template, model);
    pasteToMarker(code);
  } catch (e: any) {
    window.showErrorMessage(e.toString());
    return;
  }
};
