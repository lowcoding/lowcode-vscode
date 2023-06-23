import { useState } from '@/hooks/useImmer';

export const defaultSchema = {
  formRender: {
    model: JSON.stringify({ name: 'lowcode' }, null, 2),
    schema: JSON.stringify(
      {
        formSchema: {
          schema: {
            type: 'object',
            column: 1,
            displayType: 'column',
            properties: {
              name: {
                title: '测试表单',
                type: 'string',
                props: {},
              },
            },
          },
        },
      },
      null,
      2,
    ),
  },
  amis: {
    model: JSON.stringify({ name: 'lowcode' }, null, 2),
    schema: JSON.stringify(
      {
        formSchema: {
          schema: {
            type: 'page',
            body: [
              {
                type: 'form',
                title: '',
                body: [
                  {
                    type: 'input-text',
                    name: 'name',
                    label: '测试表单',
                    id: 'u:4886baa626cf',
                    value: '',
                  },
                ],
                id: 'u:67967afb0e69',
                submitText: '',
              },
            ],
            id: 'u:d87dbf6bf8df',
            asideResizor: false,
            style: {
              boxShadow: ' 0px 0px 0px 0px transparent',
            },
            pullRefresh: {
              disabled: true,
            },
            regions: ['body'],
          },
        },
      },

      null,
      2,
    ),
  },
  formily: {
    model: JSON.stringify({ name: 'lowcode' }, null, 2),
    schema: JSON.stringify(
      {
        formSchema: {
          schema: {
            form: {
              labelCol: 6,
              wrapperCol: 12,
              layout: 'vertical',
              labelAlign: 'left',
              fullness: false,
              inset: false,
            },
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  title: '测试表单',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-validator': [],
                  'x-component-props': {},
                  'x-decorator-props': {},
                  'x-designable-id': 'v3zwx2xtcfx',
                  'x-index': 0,
                  name: 'name',
                },
              },
              'x-designable-id': 'd4ogui2afmr',
            },
          },
        },
      },
      null,
      2,
    ),
  },
};

export const useModel = () => {
  const [formData, setFormData] = useState<{
    name: string;
    template: string;
    model: string;
    schema: string;
    schemaType: 'form-render' | 'amis' | 'formily';
    preview: string;
    commandPrompt: string;
    viewPrompt: string;
  }>({
    model: '{}',
    schemaType: 'amis',
    schema: '{}',
    preview: JSON.stringify(
      {
        title: '',
        description: '',
        img: [
          'https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg',
        ],
        category: [],
        notShowInCommand: false,
        notShowInSnippetsList: false,
        notShowInintellisense: false,
        schema: 'amis',
        scripts: [
          {
            method: 'test',
            remark: '测试一下',
          },
        ],
      },
      null,
      2,
    ),
    commandPrompt:
      '<%- rawSelectedText || rawClipboardText %>\r\n解释这段代码的意思',
    viewPrompt:
      '<%- model %> \r\n将这段 json 中，中文 key 翻译为英文，\r\n使用驼峰语法，返回翻译后的 markdown 语法的代码块',
  } as any);

  return {
    formData,
    setFormData,
  };
};

export type Model = ReturnType<typeof useModel>;
