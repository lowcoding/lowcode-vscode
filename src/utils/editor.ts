import { OpenDialogOptions, Range, SnippetString, window, env } from 'vscode';
import { getLastActiveTextEditor } from '../context';

export const getClipboardText = async () => {
  let text = '';
  try {
    text = await env.clipboard.readText();
  } catch (e) {}
  return text;
};

export const getSelectedText = () => {
  const { selection, document } = window.activeTextEditor!;
  return document.getText(selection).trim();
};

export const pasteToEditor = (content: string, isInsertSnippet = true) => {
  // vscode 本身代码片段语法
  if (isInsertSnippet) {
    return insertSnippet(content);
  }
  const activeTextEditor = getLastActiveTextEditor();
  if (activeTextEditor === undefined) {
    throw new Error('无打开文件');
  }
  return activeTextEditor?.edit((editBuilder) => {
    // editBuilder.replace(activeTextEditor.selection, content);
    if (activeTextEditor.selection.isEmpty) {
      editBuilder.insert(activeTextEditor.selection.start, content);
    } else {
      editBuilder.replace(
        new Range(
          activeTextEditor.selection.start,
          activeTextEditor.selection.end,
        ),
        content,
      );
    }
  });
};

export const insertSnippet = (content: string) => {
  const activeTextEditor = window.activeTextEditor || getLastActiveTextEditor();
  if (activeTextEditor === undefined) {
    throw new Error('无打开文件');
  }
  return activeTextEditor.insertSnippet(new SnippetString(content));
};

export const getFuncNameAndTypeName = () => {
  // 这部分代码可以写在模版里，暂时保留
  const selectedText = getSelectedText() || '';
  let funcName = 'fetch';
  let typeName = 'IFetchResult';
  if (selectedText) {
    const splitValue = selectedText.split(' ');
    funcName = splitValue[0] || funcName;
    if (splitValue.length > 1 && splitValue[1]) {
      typeName = splitValue[1];
    } else {
      typeName = `I${
        funcName.charAt(0).toUpperCase() + funcName.slice(1)
      }Result`;
    }
  }
  return {
    funcName,
    typeName,
    inputValues: selectedText.split(' '),
    rawSelectedText: selectedText,
  };
};

export const selectDirectory = async () => {
  const options: OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: 'Open',
  };
  const selectFolderUri = await window.showOpenDialog(options);
  if (selectFolderUri && selectFolderUri.length > 0) {
    return selectFolderUri[0].fsPath;
  }
};
