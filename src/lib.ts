import { window, Range } from 'vscode';
import * as copyPaste from 'copy-paste';
import * as quicktypeCore from 'quicktype-core';

export const getClipboardText = () => {
  return copyPaste.paste();
};

export const getSelectedText = () => {
  const { selection, document } = window.activeTextEditor!;
  return document.getText(selection).trim();
};

export const pasteToMarker = (content: string) => {
  const { activeTextEditor } = window;
  return activeTextEditor?.edit((editBuilder) => {
    //editBuilder.replace(activeTextEditor.selection, content);
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

export const getFuncNameAndTypeName = () => {
  const selectedText = getSelectedText() || '';
  let funcName = 'fetch';
  let typeName = 'IYapiRequestResult';
  if (selectedText) {
    const splitValue = selectedText.split(' ');
    funcName = splitValue[0] || funcName;
    if (splitValue.length > 1) {
      typeName = splitValue[1] || typeName;
    }
  }
  return {
    funcName,
    typeName,
    inputValues: selectedText.split(' '),
  };
};

export const jsonToTs = async (typeName: string, jsonString: string) => {
  const jsonInput = quicktypeCore.jsonInputForTargetLanguage('typescript');
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new quicktypeCore.InputData();
  inputData.addInput(jsonInput);

  const result = await quicktypeCore.quicktype({
    inputData,
    lang: 'typescript',
    fixedTopLevels: true,
    rendererOptions: {
      'just-types': 'true',
    },
    inferMaps: false,
    inferEnums: false,
    inferDateTimes: false,
    inferIntegerStrings: false,
  });
  return result.lines.join('\n');
};

export const jsonIsValid = (jsonString: string) => {
  if (typeof jsonString !== 'string') {
    return false;
  }
  try {
    const result = JSON.parse(jsonString);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]' || type === '[object Array]';
  } catch (err) {
    return false;
  }
};

export const isYapiId = (value: string) => {
  return /^[0-9]{1,}$/g.test(value);
};
