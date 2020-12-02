import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export const getFileContent = (filePath: string, fullPath = false) => {
  let fileContent = '';
  const fileFullPath = fullPath
    ? filePath
    : path.join(vscode.workspace.rootPath!, filePath);
  try {
    const fileBuffer = fs.readFileSync(fileFullPath);
    fileContent = fileBuffer.toString();
  } catch (error) {}
  return fileContent;
};

/**
 * 获取域名
 *
 * @returns
 */
export const getDomain = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return (
    (pkg['yapi-code.domain'] as string) ||
    vscode.workspace.getConfiguration().get('yapi-code.domain', '')
  );
};

/**
 * 获取项目列表
 *
 * @returns
 */
export const getProjectList = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return (
    (pkg['yapi-code.project'] as {
      name: string;
      token: string;
      domain: string;
    }[]) ||
    vscode.workspace
      .getConfiguration()
      .get<{ name: string; token: string; domain: string }[]>(
        'yapi-code.project',
        [],
      )
  );
};

/**
 * 获取代码模板列表
 *
 * @returns
 */
export const getCodeTemplateList = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return (
    (pkg['yapi-code.codeTemplate'] as { name: string; template: string }[]) ||
    vscode.workspace
      .getConfiguration()
      .get<{ name: string; template: string }[]>('yapi-code.codeTemplate', [])
  );
};

/**
 * 获取模板文件路径，默认为 codeTemplate 目录下
 *
 * @returns
 */
export const getTemplateFilePath = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return (
    (pkg['yapi-code.templatePath'] as string) ||
    vscode.workspace
      .getConfiguration()
      .get<string>('yapi-code.templatePath', 'codeTemplate')
  );
};

export const getCodeTemplateListFromFiles = () => {
  const list: { name: string; template: string; type: 'ejs' | 'hbs' }[] = [];
  if (vscode.workspace.rootPath) {
    const templateFullPath = path.join(
      vscode.workspace.rootPath,
      getTemplateFilePath(),
    );
    try {
      const templateFiles = fs
        .readdirSync(templateFullPath)
        .filter((s) => s.indexOf('.ejs') > -1 || s.indexOf('.hbs') > -1);
      templateFiles.map((s) => {
        const fileBuffer = fs.readFileSync(path.join(templateFullPath, s));
        const fileContent = fileBuffer.toString();
        list.push({
          name: s,
          template: fileContent,
          type: s.indexOf('ejs') > -1 ? 'ejs' : 'hbs',
        });
      });
    } catch (error) {}
  }
  return list;
};

export const getMockConfig = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return {
    number:
      (pkg['yapi-code.mockNumber'] as string) ||
      vscode.workspace
        .getConfiguration()
        .get<string>('yapi-code.mockNumber', 'Random.natural(1000,1000)'),
    boolean:
      (pkg['yapi-code.mockBoolean'] as string) ||
      vscode.workspace
        .getConfiguration()
        .get<string>('yapi-code.mockBoolean', 'false'),
    string:
      (pkg['yapi-code.mockString'] as string) ||
      vscode.workspace
        .getConfiguration()
        .get<string>('yapi-code.mockString', 'Random.cword(5, 7)'),
  };
};

export const getMockKeyWordEqualConfig = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return (
    pkg['yapi-code.mockKeyWordEqual'] ||
    vscode.workspace
      .getConfiguration()
      .get<any>('yapi-code.mockKeyWordEqual', {})
  );
};

export const getMockKeyWordLikeConfig = () => {
  const pkg = JSON.parse(getFileContent('package.json') || '{}');
  return (
    pkg['yapi-code.mockKeyWordLike'] ||
    vscode.workspace
      .getConfiguration()
      .get<any>('yapi-code.mockKeyWordLike', {})
  );
};

export const getAllConfig = () => {
  const mockConfig = getMockConfig();
  const mockKeyWordEqualConfig = getMockKeyWordEqualConfig();
  const mockKeyWordLikeConfig = getMockKeyWordLikeConfig();
  return {
    yapi: {
      domain: getDomain(),
      projects: getProjectList(),
    },
    mock: {
      mockNumber: mockConfig.number,
      mockBoolean: mockConfig.boolean,
      mockString: mockConfig.string,
      mockKeyWordEqual: Object.keys(mockKeyWordEqualConfig).map((s) => {
        return {
          key: s,
          value: mockKeyWordEqualConfig[s],
        };
      }),
      mockKeyWordLike: Object.keys(mockKeyWordLikeConfig).map((s) => {
        return {
          key: s,
          value: mockKeyWordLikeConfig[s],
        };
      }),
    },
  };
};

export const saveAllConfig = (config: {
  yapi: {
    domain: string;
    projects: {
      name: string;
      token: string;
      domain: string;
    }[];
  };
  mock: {
    mockNumber: string;
    mockBoolean: string;
    mockString: string;
    mockKeyWordEqual: { [k: string]: string };
    mockKeyWordLike: { [k: string]: string };
  };
}) => {
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.domain', config.yapi.domain, true);
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.project', config.yapi.projects, true);
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.mockNumber', config.mock.mockNumber, true);
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.mockBoolean', config.mock.mockBoolean, true);
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.mockString', config.mock.mockString, true);
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.mockKeyWordEqual', config.mock.mockKeyWordEqual, true);
  vscode.workspace
    .getConfiguration()
    .update('yapi-code.mockKeyWordLike', config.mock.mockKeyWordLike, true);
};

/**
 * 获取本地 物料模板
 *
 * @param {('blocks' | 'snippets')} type
 */
export const getLocalMaterials = (type: 'blocks' | 'snippets') => {
  const materialsPath = path.join(
    vscode.workspace.rootPath!,
    'materials',
    type,
  );
  let materials: {
    path: string;
    name: string;
    model: {};
    schema: {};
    preview: {};
    template: string;
  }[] = [];
  try {
    materials = fs.readdirSync(materialsPath).map((s) => {
      const fullPath = path.join(materialsPath, s);
      let model = {};
      let schema = {};
      let preview = {};
      let template = '';
      try {
        model = JSON.parse(
          getFileContent(path.join(fullPath, 'config', 'model.json'), true),
        );
      } catch {}
      try {
        schema = JSON.parse(
          getFileContent(path.join(fullPath, 'config', 'schema.json'), true),
        );
      } catch {}
      try {
        preview = JSON.parse(
          getFileContent(path.join(fullPath, 'config', 'preview.json'), true),
        );
      } catch {}
      if (type === 'snippets') {
        try {
          template = getFileContent(
            path.join(fullPath, 'src', 'template.ejs'),
            true,
          );
        } catch {}
      }
      return {
        path: fullPath,
        name: s,
        model: model,
        schema: schema,
        preview: preview,
        template: template,
      };
    });
  } catch {}
  return materials;
};

/**
 * 获取 codeTemplate 目录下ejs文件作为代码模板并且合并代码片段
 *
 * @export
 * @returns
 */
export function getSnippets() {
  const templates: {
    path: string;
    name: string;
    model: {};
    schema: {};
    preview: {};
    template: string;
  }[] = getCodeTemplateListFromFiles().map((s) => {
    return {
      path: '',
      name: s.name,
      model: {},
      schema: {},
      preview: {},
      template: s.template,
    };
  });
  return templates.concat(getLocalMaterials('snippets'));
}
