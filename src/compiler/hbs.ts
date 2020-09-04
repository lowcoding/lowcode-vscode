import { compile as c, registerHelper } from 'handlebars';
import { YapiInfo, Model } from './type';

registerHelper('notEmpty', (array: []) => {
  return array.length > 0;
});

registerHelper('eq', (arg1, arg2) => {
  return arg1 === arg2;
});

registerHelper('in', (item, array: any[], item2) => {
  return array.indexOf(item) > -1;
});

registerHelper('firstUpperCase', (value) => {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
});

registerHelper('index', (array: any[], index: number) => {
  return array[index];
});

export const compile = (templateString: string, model: Model) => {
  const template = c(templateString);
  return template(model);
};
