import { getCodeTemplateListFromFiles } from '../config';
import { window } from 'vscode';
import { getFuncNameAndTypeName, jsonToTs, pasteToMarker } from '../lib';
import { compile as compileHbs } from '../compiler/hbs';
import { compile as compileEjs } from '../compiler/ejs';

export const genCodeByJson = async (jsonString: string) => {
  // const templateList = getCodeTemplateList();
  const templateList = getCodeTemplateListFromFiles();
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
    const ts = await jsonToTs(selectInfo.typeName, jsonString);
    const code =
      template?.type === 'hbs'
        ? compileHbs(template!.template, {
            type: ts,
            funcName: selectInfo.funcName,
            typeName: selectInfo.typeName,
            inputValues: selectInfo.inputValues,
          })
        : compileEjs(template!.template, {
            type: ts,
            funcName: selectInfo.funcName,
            typeName: selectInfo.typeName,
            inputValues: selectInfo.inputValues,
          });
    pasteToMarker(code);
  } catch (e) {
    window.showErrorMessage(e.toString());
    return;
  }
};
