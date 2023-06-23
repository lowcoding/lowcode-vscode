import { message } from 'antd';
import { history, useModel as useUmiModel } from 'umi';
import { createBlockTemplate } from '@/webview/service';
import { useModel } from './model';

export const defaultSchema: Record<string, { model: string; schema: string }> =
  {
    'form-render': {
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
            conditionFiles: {
              name: {
                value: '123',
                exclude: ['当表单name的值为123,删除这个数组里的文件.ejs'],
              },
            },
            excludeCompile: ['不需要编译的文件,不会被删除.ejs'],
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
            conditionFiles: {
              name: {
                value: '123',
                exclude: ['当表单name的值为123,删除这个数组里的文件.ejs'],
              },
            },
            excludeCompile: ['不需要编译的文件,不会被删除.ejs'],
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
          conditionFiles: {
            name: {
              value: '123',
              exclude: ['当表单name的值为123,删除这个数组里的文件.ejs'],
            },
          },
          excludeCompile: ['不需要编译的文件,不会被删除.ejs'],
        },
        null,
        2,
      ),
    },
  };

export const usePresenter = () => {
  const model = useModel();
  const { setTab } = useUmiModel('tab');

  const closeBlockModal = () => {
    model.setBlockModal((s) => {
      s.visible = false;
      s.name = '';
    });
  };

  const handleChangeRoute = (route: string) => {
    setTab(route);
    if (history.location.pathname !== route) {
      history.push(route);
    }
  };

  const createBlock = () => {
    if (!model.blockModal.name) {
      message.success('名称不能为空');
      return;
    }
    model.setBlockModal((s) => {
      s.processing = true;
    });
    createBlockTemplate({
      name: model.blockModal.name,
      template: '在当前文件夹下放区块模板，并将此文件删除',
      model: defaultSchema[model.blockModal.schemaType].model,
      schema: defaultSchema[model.blockModal.schemaType].schema,
      preview: JSON.stringify(
        {
          title: model.blockModal.name,
          description: model.blockModal.name,
          img: [
            'https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg',
          ],
          category: [],
          schema: model.blockModal.schemaType,
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
        '<%- model %> \r\n将这段 json 中，中文 key 翻译为英文，使用驼峰语法，\r\n返回翻译后的markdown语法的代码块',
    })
      .then(() => {
        closeBlockModal();
        message.success('创建成功');
      })
      .finally(() => {
        model.setBlockModal((s) => {
          s.processing = false;
        });
      });
  };

  return { model, closeBlockModal, createBlock, handleChangeRoute };
};
