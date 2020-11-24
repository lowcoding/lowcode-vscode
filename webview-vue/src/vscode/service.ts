import { request } from './index';
export interface IGetLocalMaterialsResult {
  path: string;
  name: string;
  model: object;
  schema: object;
  preview: {
    title?: string;
    description?: string;
    img?: string;
  };
  template: string;
}
/**
 * 获取本地物料列表
 *
 * @export
 * @param {('snippets' | 'blocks')} type
 * @returns
 */
export function getLocalMaterials(type: 'snippets' | 'blocks') {
  return request<IGetLocalMaterialsResult[]>({
    cmd: 'getLocalMaterials',
    data: type,
  });
}
/**
 * 插入代码片段
 *
 * @export
 * @param {{ template: string }} code
 * @returns
 */
export function insertSnippet(code: { template: string }) {
  return request({
    cmd: 'insertSnippet',
    data: code,
  });
}
/**
 * json 转 ts 类型
 *
 * @export
 * @param {{ json: Object; typeName: string }} data
 * @returns
 */
export function jsonToTs(data: { json: Object; typeName: string }) {
  return request<string>({
    cmd: 'jsonToTs',
    data: data,
  });
}
/**
 * 根据代码片段物料生成代码
 *
 * @export
 * @param {{ model: object; template: string }} data
 * @returns
 */
export function genCodeBySnippetMaterial(data: { model: object; template: string }) {
  return request({
    cmd: 'genCodeBySnippetMaterial',
    data: data,
  });
}
/**
 * 获取 yapi 域名
 *
 * @export
 * @returns
 */
export function getYapiDomain() {
  return request<string>({
    cmd: 'getYapiDomain',
  });
}

/**
 * 获取 yapi 项目列表
 *
 * @export
 * @returns
 */
export function getYapiProjects() {
  return request<{ name: string; token: string; domain: string }[]>({
    cmd: 'getYapiProjects',
  });
}

/**
 * 拉取 yapi 接口信息生成 model
 *
 * @export
 * @param {{
 *   domain: string;
 *   id: string;
 *   token: string;
 *   typeName?: string;
 *   funName?: string;
 * }} data
 * @returns
 */
export function genTemplateModelByYapi(data: {
  domain: string;
  id: string;
  token: string;
  typeName?: string;
  funName?: string;
}) {
  return request({
    cmd: 'genTemplateModelByYapi',
    data: data,
  });
}
