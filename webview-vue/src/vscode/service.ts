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

export function getLocalMaterials(type: 'snippets' | 'blocks') {
  return request<IGetLocalMaterialsResult[]>({
    cmd: 'getLocalMaterials',
    data: type,
  });
}

export function insertSnippet(code: { template: string }) {
  return request({
    cmd: 'insertSnippet',
    data: code,
  });
}

export function jsonToTs(data: { json: Object; typeName: string }) {
  return request<string>({
    cmd: 'jsonToTs',
    data: data,
  });
}
