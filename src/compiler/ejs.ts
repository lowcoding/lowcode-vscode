import * as ejs from 'ejs';
import { YapiInfo, Model } from './type';

export const compile = (templateString: string, model: Model) => {
  return ejs.render(templateString, model);
};
