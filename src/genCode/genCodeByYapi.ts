import {
  getDomain,
  getProjectList,
  getCodeTemplateListFromFiles,
} from '../config';
import { window } from 'vscode';
import { compile } from 'json-schema-to-typescript';
import { compile as compileHbs } from '../compiler/hbs';
import { compile as compileEjs } from '../compiler/ejs';
import {
  getFuncNameAndTypeName,
  pasteToMarker,
  jsonToTs,
  formatSchema,
} from '../lib';
import { fetchApiDetailInfo } from '../service';
const strip = require('strip-comments');
const GenerateSchema = require('generate-schema');

export const genCodeByYapi = async (yapiId: string) => {
  const domain = getDomain();
  if (!domain.trim()) {
    window.showErrorMessage('请配置yapi域名');
    return;
  }
  const projectList = getProjectList();
  if (projectList.length === 0) {
    window.showErrorMessage('请配置项目');
    return;
  }
  //const templateList = getCodeTemplateList();
  const templateList = getCodeTemplateListFromFiles();
  if (templateList.length === 0) {
    window.showErrorMessage('请配置模板');
    return;
  }
  const selectInfo = getFuncNameAndTypeName();
  const requestBodyTypeName =
    selectInfo.funcName.slice(0, 1).toUpperCase() +
    selectInfo.funcName.slice(1);
  const result = await window.showQuickPick(
    projectList.map((s) => s.name),
    { placeHolder: '请选择项目' },
  );
  if (!result) {
    return;
  }

  const templateResult = await window.showQuickPick(
    templateList.map((s) => s.name),
    { placeHolder: '请选择模板' },
  );
  if (!templateResult) {
    return;
  }

  const project = projectList.find((s) => s.name === result);
  const template = templateList.find((s) => s.name === templateResult);
  try {
    const res = await fetchApiDetailInfo(domain, yapiId, project!.token);
    if (res.data.data.res_body_type === 'json') {
      const schema = JSON.parse(res.data.data.res_body);
      delete schema.title;
      let ts = await compile(schema, selectInfo.typeName, {
        bannerComment: undefined,
      });
      ts = strip(ts.replace(/(\[k: string\]: unknown;)|\?/g, ''));
      const { mockCode, mockData } = formatSchema(schema);
      let requestBodyType = '';
      if (res.data.data.req_body_other) {
        const reqBodyScheme = JSON.parse(res.data.data.req_body_other);
        delete reqBodyScheme.title;
        requestBodyType = await compile(
          reqBodyScheme,
          `I${requestBodyTypeName}Data`,
          {
            bannerComment: undefined,
          },
        );
      }
      const code =
        template?.type === 'hbs'
          ? compileHbs(template!.template, {
              type: ts,
              requestBodyType: strip(
                requestBodyType.replace(/\[k: string\]: unknown;/g, ''),
              ),
              funcName: selectInfo.funcName,
              typeName: selectInfo.typeName,
              api: res.data.data,
              inputValues: selectInfo.inputValues,
              mockCode,
              mockData,
              jsonData: {},
            })
          : compileEjs(template!.template, {
              type: ts,
              requestBodyType: strip(
                requestBodyType.replace(/\[k: string\]: unknown;/g, ''),
              ),
              funcName: selectInfo.funcName,
              typeName: selectInfo.typeName,
              api: res.data.data,
              inputValues: selectInfo.inputValues,
              mockCode,
              mockData,
              jsonData: {},
            });
      pasteToMarker(code);
    } else {
      //const ts = await jsonToTs(selectInfo.typeName, res.data.data.res_body);
      const resBodyJson = JSON.parse(res.data.data.res_body);
      const schema = GenerateSchema.json('Schema', resBodyJson);
      let ts = await compile(schema, selectInfo.typeName, {
        bannerComment: undefined,
      });
      ts = strip(ts.replace(/(\[k: string\]: unknown;)|\?/g, ''));
      const { mockCode, mockData } = formatSchema(schema);
      let requestBodyType = '';
      if (res.data.data.req_body_other) {
        const reqBodyScheme = JSON.parse(res.data.data.req_body_other);
        delete reqBodyScheme.title;
        requestBodyType = await compile(
          reqBodyScheme,
          `I${requestBodyTypeName}Data`,
          {
            bannerComment: undefined,
          },
        );
      }
      const code =
        template?.type === 'hbs'
          ? compileHbs(template!.template, {
              type: ts,
              requestBodyType: strip(
                requestBodyType.replace(/\[k: string\]: unknown;/g, ''),
              ),
              funcName: selectInfo.funcName,
              typeName: selectInfo.typeName,
              api: res.data.data,
              inputValues: selectInfo.inputValues,
              mockCode,
              mockData,
              jsonData: resBodyJson,
            })
          : compileEjs(template!.template, {
              type: ts,
              requestBodyType: strip(
                requestBodyType.replace(/\[k: string\]: unknown;/g, ''),
              ),
              funcName: selectInfo.funcName,
              typeName: selectInfo.typeName,
              api: res.data.data,
              inputValues: selectInfo.inputValues,
              mockCode,
              mockData,
              jsonData: resBodyJson,
            });
      pasteToMarker(code);
    }
  } catch (e) {
    window.showErrorMessage(e.toString());
    return;
  }
};
