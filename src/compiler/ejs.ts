import * as ejs from 'ejs';
import { YapiInfo } from './type';

export const compile = (
  templateString: string,
  model: {
    type: string;
    requestBodyType?: string;
    funcName: string;
    typeName: string;
    inputValues: string[];
    api?: YapiInfo;
    mockCode: string;
    mockData: string;
    jsonData: any;
    jsonKeys?: string[];
  },
) => {
  return ejs.render(templateString, model);
};
