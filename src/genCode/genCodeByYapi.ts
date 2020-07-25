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
    window.showErrorMessage('请配置模板1212');
    return;
  }
  const selectInfo = getFuncNameAndTypeName();
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
      const ts = await compile(schema, selectInfo.typeName, {
        bannerComment: undefined,
      });
      const { mockCode, mockData } = formatSchema(schema);
      let requestBodyType = '';
      if (res.data.data.req_body_other) {
        requestBodyType = await compile(
          JSON.parse(res.data.data.req_body_other),
          'IRequestBody',
          {
            bannerComment: undefined,
          },
        );
      }
      const code =
        template?.type === 'hbs'
          ? compileHbs(template!.template, {
              type: strip(ts.replace(/\[k: string\]: unknown;/g, '')),
              requestBodyType: strip(
                requestBodyType.replace(/\[k: string\]: unknown;/g, ''),
              ),
              funcName: selectInfo.funcName,
              typeName: selectInfo.typeName,
              api: res.data.data,
              inputValues: selectInfo.inputValues,
              mockCode,
              mockData,
            })
          : compileEjs(template!.template, {
              type: strip(ts.replace(/\[k: string\]: unknown;/g, '')),
              requestBodyType: strip(
                requestBodyType.replace(/\[k: string\]: unknown;/g, ''),
              ),
              funcName: selectInfo.funcName,
              typeName: selectInfo.typeName,
              api: res.data.data,
              inputValues: selectInfo.inputValues,
              mockCode,
              mockData,
            });
      pasteToMarker(code);
    } else {
      const ts = await jsonToTs(selectInfo.typeName, res.data.data.res_body);
      const schema = GenerateSchema.json(
        'Schema',
        JSON.parse(res.data.data.res_body),
      );
      const { mockCode, mockData } = formatSchema(schema);
      let requestBodyType = '';
      if (res.data.data.req_body_other) {
        requestBodyType = await compile(
          JSON.parse(res.data.data.req_body_other),
          'IRequestBody',
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
            });
      pasteToMarker(code);
    }
  } catch (e) {
    window.showErrorMessage(e.toString());
    return;
  }
};
