import * as ejs from 'ejs';
import { YapiInfo } from './type';

export const compile = (
  templateString: string,
  model: {
    type: string;
    funcName: string;
    typeName: string;
    inputValues: string[];
    api?: YapiInfo;
  },
) => {
  return ejs.render(templateString, model);
};
