import { window, Range } from 'vscode';
import * as copyPaste from 'copy-paste';
import * as quicktypeCore from 'quicktype-core';
import { getMockConfig } from './config';

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

export const formatSchema = (schema: any) => {
  let listIndex = 1;
  const mockConfig = getMockConfig();
  const formatProperty = (property: any, key?: string) => {
    let jsonStr = '';
    let listStr: string[] = [];
    if (property.type === 'object') {
      jsonStr = jsonStr + `${key ? key + ': {' : ''}`;
      Object.keys(property.properties).map((childPropertyKey) => {
        const childProperty = property.properties[childPropertyKey];
        const { jsonStr: childJsonStr, listStr: childListStr } = formatProperty(
          childProperty,
          childPropertyKey,
        );
        jsonStr = jsonStr + childJsonStr;
        listStr = listStr.concat(childListStr);
      });
      jsonStr = jsonStr + `${key ? '},' : ''}`;
    } else if (property.type === 'array') {
      if (Object.keys(property.items).length > 0) {
        const index = listIndex;
        listIndex++;
        let itemStr = `
		   const list${index}=[];
		   for(let i = 0; i < 10 ; i++){
			list${index}.push(
		`;
        if (property.items.type === 'object') {
          itemStr = itemStr + '{';
          Object.keys(property.items.properties).map((itemPropertyKey) => {
            const itemProperty = property.items.properties[itemPropertyKey];
            const {
              jsonStr: itemJsonStr,
              listStr: itemListStr,
            } = formatProperty(itemProperty, itemPropertyKey);
            itemStr = itemStr + itemJsonStr;
            listStr = listStr.concat(itemListStr);
          });
          itemStr = itemStr + `})}`;
        } else {
          if (property.items.type === 'string') {
            itemStr = itemStr + mockConfig.string;
          } else {
            itemStr = itemStr + mockConfig.number;
          }
          itemStr = itemStr + `)}`;
        }
        listStr.push(itemStr);
        jsonStr = jsonStr + `${key}: list${index},`;
      } else {
        jsonStr = jsonStr + `${key}: [],`;
      }
    } else if (property.type === 'number') {
      jsonStr = jsonStr + `${key}: ${mockConfig.number},`;
    } else if (property.type === 'boolean') {
      jsonStr = jsonStr + `${key}: ${mockConfig.boolean},`;
    } else if (property.type === 'string') {
      jsonStr = jsonStr + `${key}: ${mockConfig.string},`;
    }
    return {
      jsonStr,
      listStr,
    };
  };
  const { jsonStr, listStr } = formatProperty(schema);
  return {
    mockCode: listStr.join('\n'),
    mockData: `{${jsonStr}}`,
  };
};
