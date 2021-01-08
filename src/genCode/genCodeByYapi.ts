import {
  getDomain,
  getProjectList,
  getCodeTemplateListFromFiles,
  getSnippets,
} from '../config';
import { window } from 'vscode';
import { compile } from 'json-schema-to-typescript';
import { compile as compileEjs } from '../compiler/ejs';
import {
  getFuncNameAndTypeName,
  pasteToMarker,
  jsonToTs,
  formatSchema,
} from '../lib';
import { fetchApiDetailInfo } from '../service';
import { Model } from '../compiler/type';
const strip = require('strip-comments');
const stripJsonComments = require('strip-json-comments');
const GenerateSchema = require('generate-schema');

export const genCodeByYapi = async (
  yapiId: string,
  rawClipboardText: string,
) => {
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
  //const templateList = getCodeTemplateListFromFiles();
  const templateList = getSnippets();
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
    const model = await genTemplateModelByYapi(
      project?.domain || domain,
      yapiId,
      project!.token,
      selectInfo.typeName,
      selectInfo.funcName,
    );
    model.inputValues = selectInfo.inputValues;
    model.rawSelectedText = selectInfo.rawSelectedText;
    model.rawClipboardText = rawClipboardText;
    const code = compileEjs(template!.template, model);
    pasteToMarker(code);
  } catch (e) {
    window.showErrorMessage(e.toString());
    return;
  }
};

export const genTemplateModelByYapi = async (
  domain: string,
  yapiId: string,
  token: string,
  typeName: string = 'IYapiRequestResult',
  funcName: string = 'fetch',
) => {
  const res = await fetchApiDetailInfo(domain, yapiId, token);
  const requestBodyTypeName =
    funcName.slice(0, 1).toUpperCase() + funcName.slice(1);
  if (res.data.data.res_body_type === 'json') {
    const schema = JSON.parse(stripJsonComments(res.data.data.res_body));
    delete schema.title;
    let ts = await compile(schema, typeName, {
      bannerComment: undefined,
    });
    ts = strip(ts.replace(/(\[k: string\]: unknown;)|\?/g, ''));
    const { mockCode, mockData } = formatSchema(schema);
    let requestBodyType = '';
    if (res.data.data.req_body_other) {
      const reqBodyScheme = JSON.parse(
        stripJsonComments(res.data.data.req_body_other),
      );
      delete reqBodyScheme.title;
      requestBodyType = await compile(
        reqBodyScheme,
        `I${requestBodyTypeName}Data`,
        {
          bannerComment: undefined,
        },
      );
    }
    const model: Model = {
      type: ts,
      requestBodyType: strip(
        requestBodyType.replace(/\[k: string\]: unknown;/g, ''),
      ),
      funcName: funcName,
      typeName: typeName,
      api: res.data.data,
      inputValues: [],
      mockCode,
      mockData,
      jsonData: {},
      rawSelectedText: '',
      rawClipboardText: '',
    };
    return model;
  } else {
    //const ts = await jsonToTs(selectInfo.typeName, res.data.data.res_body);
    const resBodyJson = JSON.parse(stripJsonComments(res.data.data.res_body));
    const schema = GenerateSchema.json(typeName || 'Schema', resBodyJson);
    let ts = await compile(schema, typeName, {
      bannerComment: undefined,
    });
    ts = strip(ts.replace(/(\[k: string\]: unknown;)|\?/g, ''));
    const { mockCode, mockData } = formatSchema(schema);
    let requestBodyType = '';
    if (res.data.data.req_body_other) {
      const reqBodyScheme = JSON.parse(
        stripJsonComments(res.data.data.req_body_other),
      );
      delete reqBodyScheme.title;
      requestBodyType = await compile(
        reqBodyScheme,
        `I${requestBodyTypeName}Data`,
        {
          bannerComment: undefined,
        },
      );
    }
    const model: Model = {
      type: ts,
      requestBodyType: strip(
        requestBodyType.replace(/\[k: string\]: unknown;/g, ''),
      ),
      funcName: funcName,
      typeName: typeName,
      api: res.data.data,
      inputValues: [],
      mockCode,
      mockData,
      jsonData: resBodyJson,
      rawClipboardText: '',
      rawSelectedText: '',
    };
    return model;
  }
};
