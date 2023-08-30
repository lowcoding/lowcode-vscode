import * as path from 'path';
import * as fs from 'fs';
import { getFileContent } from './file';
import { getTemplateFilePath } from './config';
import {
  rootPath,
  snippetMaterialsPath,
  getPrivateSnippetMaterialsPath,
} from './vscodeEnv';

/**
 * 获取本地 物料模板
 *
 * @param {('blocks' | 'snippets')} type
 */
export const getLocalMaterials = (
  type: 'blocks' | 'snippets',
  materialsFullPath: string,
  privateMaterials?: boolean,
) => {
  let materials: {
    path: string;
    name: string;
    model: {};
    schema: {};
    preview: {
      title?: string;
      description?: string;
      img?: string | string[];
      category?: string[];
      notShowInCommand?: boolean;
      notShowInSnippetsList?: boolean;
      notShowInintellisense?: boolean;
      schema?: string;
      chatGPT?: {
        commandPrompt?: string;
        viewPrompt?: string;
      };
      scripts?: [{ method: string; remark: string }];
    };
    commandPrompt?: string; // 优先级比 preview.chatGPT 高
    viewPrompt?: string; // 优先级比 preview.chatGPT 高
    template: string;
    privateMaterials?: boolean;
  }[] = [];
  try {
    materials = fs.readdirSync(materialsFullPath).map((s) => {
      const fullPath = path.join(materialsFullPath, s);
      let model = {} as any;
      let schema = {} as any;
      let preview = {
        img: '',
        category: [],
        schema: 'form-render',
        chatGPT: { commandPrompt: '', viewPrompt: '' },
      };
      let template = '';
      let commandPrompt = '';
      let viewPrompt = '';
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
      try {
        commandPrompt = getFileContent(
          path.join(fullPath, 'config', 'commandPrompt.ejs'),
          true,
        );
      } catch {}
      try {
        viewPrompt = getFileContent(
          path.join(fullPath, 'config', 'viewPrompt.ejs'),
          true,
        );
      } catch {}
      if (!preview.img) {
        preview.img =
          'https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg';
      }
      if (!preview.schema) {
        preview.schema = 'form-render';
      }
      if (!commandPrompt) {
        commandPrompt = preview.chatGPT?.commandPrompt;
      }
      if (!viewPrompt) {
        viewPrompt = preview.chatGPT?.viewPrompt;
      }

      if (type === 'snippets') {
        try {
          template = getFileContent(
            path.join(fullPath, 'src', 'template.ejs'),
            true,
          );
        } catch {}
      }
      if (schema.formSchema) {
        if (schema.formSchema.formData) {
          model = schema.formSchema.formData;
        }
        schema = schema.formSchema.schema;
      }
      if (Object.keys(schema).length > 0 && preview.schema === 'amis') {
        // 设置 page 默认 name
        schema.name = 'page';
        if (schema.body && Array.isArray(schema.body)) {
          schema.body.forEach((s: Record<string, unknown>) => {
            if (s.type === 'form') {
              s.name = 'form';
              if (s.data && Object.keys(model).length === 0) {
                model = s.data;
              } else if (!s.data && Object.keys(model).length > 0) {
                s.data = model;
              }
            }
          });
        }
      }
      return {
        path: fullPath,
        name: s,
        model,
        schema,
        preview,
        template,
        commandPrompt,
        viewPrompt,
        privateMaterials,
      };
    });
  } catch {}
  return materials.filter((s) => s.name !== '.DS_Store');
};

export const getCodeTemplateListFromFiles = () => {
  const list: { name: string; template: string; type: 'ejs' }[] = [];
  const templateFullPath = path.join(rootPath, getTemplateFilePath());
  try {
    const templateFiles = fs
      .readdirSync(templateFullPath)
      .filter((s) => s.indexOf('.ejs') > -1);
    templateFiles.map((s) => {
      const fileBuffer = fs.readFileSync(path.join(templateFullPath, s));
      const fileContent = fileBuffer.toString();
      list.push({
        name: s,
        template: fileContent,
        type: 'ejs',
      });
    });
  } catch (error) {}
  return list;
};

/**
 * 获取 codeTemplate 目录下ejs文件作为代码模板并且合并代码片段 (兼容以前旧代码)
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
    preview: {
      title?: string;
      description?: string;
      img?: string | string[];
      category?: string[];
      notShowInCommand?: boolean;
      notShowInSnippetsList?: boolean;
      notShowInintellisense?: boolean;
      schema?: string;
      chatGPT?: {
        commandPrompt?: string;
        viewPrompt?: string;
      };
    };
    commandPrompt?: string; // 优先级比 preview.chatGPT 高
    viewPrompt?: string; // 优先级比 preview.chatGPT 高
    template: string;
    privateMaterials?: boolean;
  }[] = getCodeTemplateListFromFiles().map((s) => ({
    path: s.name,
    name: s.name,
    model: {},
    schema: {},
    preview: {
      img: 'https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg',
      category: [],
    },
    template: s.template,
    privateMaterials: false,
  }));
  let snippetsMaterials = getLocalMaterials('snippets', snippetMaterialsPath);
  if (getPrivateSnippetMaterialsPath()) {
    const privateSnippetsMaterials = getLocalMaterials(
      'snippets',
      getPrivateSnippetMaterialsPath(),
      true,
    );
    snippetsMaterials = snippetsMaterials.concat(privateSnippetsMaterials);
  }
  return templates.concat(snippetsMaterials);
}
