export const getSchemaWebUrl = (
  schema: 'form-render' | 'amis' | 'formily' | string,
) => {
  if (schema === 'amis') {
    return 'https://aisuda.github.io/amis-editor-demo/#/edit/0';
  }
  if (schema === 'form-render') {
    return 'https://1.xrender.fun/~demos/generator-demo';
  }
  if (schema === 'formily') {
    return 'https://designable-antd.formilyjs.org/';
  }
};
