import { useState } from '@/hooks/useImmer';

export const defaultSchema = {
  formRender: {
    model: JSON.stringify({ name: '6666' }, null, 2),
    schema: JSON.stringify(
      {
        formSchema: {
          schema: {
            type: 'object',
            column: 1,
            labelWidth: 120,
            displayType: 'row',
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
    model: JSON.stringify({ name: '6666' }, null, 2),
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
    model: JSON.stringify({}, null, 2),
    schema: JSON.stringify(
      {
        formSchema: {
          schema: {},
        },
      },
      null,
      2,
    ),
  },
};

const useModel = () => {
  const [formData, setFormData] = useState<{
    name: string;
    template: string;
    model: string;
    schema: string;
    schemaType: 'form-render' | 'amis' | 'formily';
    preview: string;
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
        chatGPT: {
          commandPrompt:
            '<%- rawSelectedText || rawClipboardText %> 解释这段代码的意思',
          viewPrompt:
            '<%- model %> \r\n将这段 json 中，中文 key 翻译为英文，使用驼峰语法，返回翻译后的markdown语法的代码块',
        },
      },
      null,
      2,
    ),
  } as any);

  return {
    formData,
    setFormData,
  };
};

export default useModel;
