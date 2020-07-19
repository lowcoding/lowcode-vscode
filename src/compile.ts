import { compile as c, registerHelper } from 'handlebars';

type YapiInfo = {
  query_path: { path: string };
  method: string;
  title: string;
  project_id: number;
  req_params: {
    name: string;
    desc: string;
  }[];
  _id: number;
  req_query: { required: '0' | '1'; name: string }[];
  res_body_type: 'raw' | 'json';
  res_body: string;
  username: string;
};

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
  const template = c(templateString);
  return template(model);
};
