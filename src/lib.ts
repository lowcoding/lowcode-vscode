import {
  window,
  Range,
  workspace,
  SnippetString,
  OpenDialogOptions,
} from 'vscode';
import * as os from 'os';
import * as copyPaste from 'copy-paste';
import * as quicktypeCore from 'quicktype-core';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as execa from 'execa';
import * as TJS from 'typescript-json-schema';
const tar = require('tar');
import {
  getMockConfig,
  getMockKeyWordEqualConfig,
  getMockKeyWordLikeConfig,
} from './config';
import { download } from './utils/download';
import { renderEjsTemplates } from './compiler/ejs';
import Axios from 'axios';

export const getClipboardText = () => {
  return copyPaste.paste();
};

export const getSelectedText = () => {
  const { selection, document } = window.activeTextEditor!;
  return document.getText(selection).trim();
};

export const pasteToMarker = (content: string, isInsertSnippet = true) => {
  if (isInsertSnippet) {
    return insertSnippet(content);
  }
  const activeTextEditor = window.activeTextEditor || getLastAcitveTextEditor();
  if (activeTextEditor === undefined) {
    throw new Error('无打开文件');
  }
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

export const insertSnippet = (content: string) => {
  const activeTextEditor = window.activeTextEditor || getLastAcitveTextEditor();
  if (activeTextEditor === undefined) {
    throw new Error('无打开文件');
  }
  return activeTextEditor.insertSnippet(new SnippetString(content));
};

export const getFuncNameAndTypeName = () => {
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

export const jsonParse = (clipboardText: string) => {
  if (typeof clipboardText !== 'string') {
    return '';
  }
  let func: any = function () {
    return '';
  };
  if (
    clipboardText.startsWith('var') ||
    clipboardText.startsWith('let') ||
    clipboardText.startsWith('const')
  ) {
    clipboardText = clipboardText.replace(/(var|let|const).*=/, '');
  }
  try {
    func = new Function(`return ${clipboardText.trim()}`);
    return func();
  } catch (ex) {
    return '';
  }
};

export const formatSchema = (schema: any) => {
  let listIndex = 1;
  const mockConfig = getMockConfig();

  const getMockValue = (key: string, defaultValue: string, type = 'number') => {
    let value = defaultValue;
    const mockKeyWordEqualConfig = getMockKeyWordEqualConfig();
    const equalKeys = Object.keys(mockKeyWordEqualConfig);
    for (let i = 0; i < equalKeys.length; i++) {
      if (key.toUpperCase() === equalKeys[i].toUpperCase()) {
        if (typeof mockKeyWordEqualConfig[equalKeys[i]] === 'string') {
          const array = (mockKeyWordEqualConfig[equalKeys[i]] as string).split(
            '&&',
          );
          if (array.length > 1) {
            if (type === array[1]) {
              return array[0];
            } else {
              return value;
            }
          }
        }
        return mockKeyWordEqualConfig[equalKeys[i]];
      }
    }
    const mockKeyWordLikeConfig = getMockKeyWordLikeConfig();
    const likeKeys = Object.keys(mockKeyWordLikeConfig);
    for (let i = 0; i < likeKeys.length; i++) {
      if (key.toUpperCase().indexOf(likeKeys[i].toUpperCase()) > -1) {
        if (typeof mockKeyWordLikeConfig[likeKeys[i]] === 'string') {
          const array = (mockKeyWordLikeConfig[likeKeys[i]] as string).split(
            '&&',
          );
          if (array.length > 1) {
            if (type === array[1]) {
              return array[0];
            } else {
              return value;
            }
          }
        }
        return mockKeyWordLikeConfig[likeKeys[i]];
      }
    }

    return value;
  };

  const formatProperty = (property: any, key: string = '') => {
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
            itemStr = itemStr + getMockValue(key, mockConfig.string, 'string');
          } else {
            itemStr = itemStr + getMockValue(key, mockConfig.number);
          }
          itemStr = itemStr + `)}`;
        }
        listStr.push(itemStr);
        jsonStr = jsonStr + `${key}: list${index},`;
      } else {
        jsonStr = jsonStr + `${key}: [],`;
      }
    } else if (property.type === 'number') {
      jsonStr = jsonStr + `${key}: ${getMockValue(key, mockConfig.number)},`;
    } else if (property.type === 'boolean') {
      jsonStr =
        jsonStr +
        `${key}: ${getMockValue(key, mockConfig.boolean, 'boolean')},`;
    } else if (property.type === 'string') {
      jsonStr =
        jsonStr + `${key}: ${getMockValue(key, mockConfig.string, 'string')},`;
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

export const getFileContent = (filePath: string, fullPath = false) => {
  let fileContent = '';
  const fileFullPath = fullPath
    ? filePath
    : path.join(workspace.rootPath!, filePath);
  try {
    const fileBuffer = fs.readFileSync(fileFullPath);
    fileContent = fileBuffer.toString();
  } catch (error) {}
  return fileContent;
};

let activeTextEditorId: string;
export const getLastAcitveTextEditor = () => {
  const { visibleTextEditors } = window;
  const activeTextEditor = visibleTextEditors.find(
    (item: any) => item.id === activeTextEditorId,
  );
  return activeTextEditor;
};
export const setLastActiveTextEditorId = (id: string) => {
  activeTextEditorId = id;
};

export const downloadMaterialsFromGit = (remote: string) => {
  const tempDir = path.join(workspace.rootPath!, '.lowcode');
  const materialsDir = path.join(workspace.rootPath!, 'materials');
  fs.removeSync(tempDir);
  execa.sync('git', ['clone', ...remote.split(' '), tempDir]);
  fs.copySync(path.join(tempDir, 'materials'), path.join(materialsDir));
  fs.removeSync(tempDir);
};

export const downloadMaterialsFromNpm = async (packageName: string) => {
  const result = execa.sync('npm', ['view', packageName, 'dist.tarball']);
  const tarball = result.stdout;
  const tempDir = path.join(workspace.rootPath!, '.lowcode');
  fs.removeSync(tempDir);
  await download(tarball, tempDir, `temp.tgz`);
  await tar.x({
    file: path.join(tempDir, `temp.tgz`),
    C: tempDir,
    strip: 1,
  });
  const materialsDir = path.join(workspace.rootPath!, 'materials');
  fs.copySync(path.join(tempDir, 'materials'), materialsDir);
  fs.removeSync(tempDir);
};

export const downloadScaffoldFromGit = (remote: string) => {
  const tempDir = path.join(os.homedir(), '.lowcode/scaffold');
  fs.removeSync(tempDir);
  execa.sync('git', ['clone', ...remote.split(' '), tempDir]);
  fs.removeSync(path.join(tempDir, '.git'));
  if (fs.existsSync(path.join(tempDir, 'lowcode.scaffold.config.json'))) {
    return fs.readJSONSync(path.join(tempDir, 'lowcode.scaffold.config.json'));
  } else {
    return {};
  }
};

export const compileScaffold = async (model: any, createDir: string) => {
  const tempDir = path.join(os.homedir(), '.lowcode/scaffold');
  if (fs.existsSync(path.join(tempDir, 'lowcode.scaffold.config.json'))) {
    const config = fs.readJSONSync(
      path.join(tempDir, 'lowcode.scaffold.config.json'),
    );
    const excludeCompile: string[] = config.excludeCompile || [];
    if (config.conditionFiles) {
      Object.keys(model).map((key) => {
        if (
          config.conditionFiles[key] &&
          config.conditionFiles[key]['value'] === model[key] &&
          Array.isArray(config.conditionFiles[key]['exclude'])
        ) {
          config.conditionFiles[key]['exclude'].map((exclude: string) => {
            fs.removeSync(path.join(tempDir, exclude));
          });
        }
      });
    }
    await renderEjsTemplates(model, tempDir, excludeCompile);
    fs.removeSync(path.join(tempDir, 'lowcode.scaffold.config.json'));
  }
  fs.copySync(tempDir, createDir);
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

export const checkVankeInternal = () => {
  return Axios.get('https://npm.bu6.io')
    .then((res) => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

export const typescriptToJson = (oriType: string) => {
  let type = oriType;
  const tempDir = path.join(os.homedir(), '.lowcode/temp');
  const filePath = path.join(tempDir, 'ts.ts');
  if (!fs.existsSync(filePath)) {
    fs.createFileSync(filePath);
  }

  // 处理最外层是数组类型的场景
  if (!type.trim().endsWith('}')) {
    type = `{ result: ${type} }`;
  }
  fs.writeFileSync(filePath, `export interface TempType ${type}`, {
    encoding: 'utf-8',
  });

  const program = TJS.getProgramFromFiles([filePath]);
  const schema = TJS.generateSchema(program, 'TempType') as any;
  if (schema === null) {
    throw new Error('根据TS类型生成JSON Schema失败');
  }
  const { mockCode, mockData } = formatSchema(schema);
  return {
    mockCode,
    mockData: !oriType.trim().endsWith('}') ? 'list1' : mockData,
  };
};
