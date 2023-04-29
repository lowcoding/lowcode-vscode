export default [
  {
    path: '1',
    name: 'amis schema',
    model: {
      string: '',
      select: 'a',
    },
    schema: {
      type: 'page',
      name: 'page',
      body: [
        {
          type: 'form',
          name: 'form',
          title: '',
          body: [
            {
              type: 'combo',
              label: '组合输入',
              name: 'combo',
              multiple: true,
              addable: true,
              removable: true,
              removableMode: 'icon',
              addBtn: {
                label: '新增',
                icon: 'fa fa-plus',
                level: 'primary',
                size: 'sm',
                id: 'u:0015b453e1e9',
              },
              items: [
                {
                  type: 'grid',
                  columns: [
                    {
                      body: [
                        {
                          type: 'input-text',
                          label: '文本',
                          name: 'name',
                          id: 'u:2191438a6251',
                          autoFill: {},
                          autoComplete:
                            'http://127.0.0.1:3001/options/autoComplete?term=$term',
                          selectMode: 'group',
                          searchResultMode: 'group',
                          multiple: false,
                          size: 'full',
                        },
                      ],
                      id: 'u:3c12ba36624e',
                    },
                    {
                      body: [
                        {
                          type: 'select',
                          label: '选项自动补全',
                          name: 'select',
                          autoComplete:
                            'http://127.0.0.1:3001/options/autoComplete?term=$term',
                          placeholder: '请输入',
                          id: 'u:8f5cc9abb73b',
                          multiple: false,
                          creatable: false,
                          editable: false,
                          removable: false,
                        },
                      ],
                      id: 'u:db4556a4adea',
                    },
                  ],
                  id: 'u:af9411354435',
                },
                {
                  type: 'select',
                  label: '选项',
                  name: 'name',
                  selectMode: 'table',
                  columns: [
                    {
                      name: 'label',
                      label: '英雄',
                    },
                    {
                      name: 'position',
                      label: '位置',
                    },
                  ],
                  id: 'u:b64d3a5709a6',
                  autoComplete:
                    'http://127.0.0.1:3001/options/autoComplete?term=$term',
                  searchable: true,
                  searchApi:
                    'http://127.0.0.1:3001/options/autoComplete?term=$term',
                },
              ],
              id: 'u:511b04658e5b',
              strictMode: true,
              syncFields: [],
              placeholder: '7878787878',
              draggable: true,
              tabsMode: true,
              tabsStyle: 'radio',
              size: 'full',
              canAccessSuperData: false,
              multiLine: true,
              deleteConfirmText: '确认要删除吗？',
              deleteApi: {
                url: '',
                method: 'get',
                messages: {
                  failed: 'tytyty',
                  success: 'erererer',
                },
              },
              description: '',
            },
          ],
          id: 'u:67967afb0e69',
          submitText: '',
          data: {
            combo: [{}],
          },
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
    preview: {
      title: 'amis schema',
      description: 'amis schema',
      img: [
        'https://fastly.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg',
        'https://s1.ax1x.com/2023/04/16/p9CenKS.jpg',
      ],
      schema: 'amis',
    },
    template: '1212121',
  },
  {
    path: '2',
    name: '2',
    model: {
      select: 'c',
      includeContext: false,
      includeStyle: true,
      form: [],
    },
    schema: {
      type: 'object',
      properties: {
        dialog: {
          title: '是否弹框',
          type: 'boolean',
          'ui:widget': 'switch',
        },
        props: {
          title: '是否传入props',
          type: 'boolean',
          'ui:widget': 'switch',
        },
        includeApi: {
          title: '包含api文件',
          type: 'boolean',
          'ui:widget': 'switch',
        },
        includeContext: {
          title: '包含useContext',
          type: 'boolean',
          'ui:widget': 'switch',
          description: '',
          default: false,
        },
        includeStyle: {
          title: '包含样式',
          type: 'boolean',
          'ui:widget': 'switch',
          description: '',
          default: true,
        },
        className: {
          title: 'className',
          type: 'string',
          'ui:options': {},
        },
        name: {
          title: '组件名称',
          type: 'string',
          'ui:options': {},
        },
        form: {
          title: '表单',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                title: '类型',
                type: 'string',
                enum: ['Input', 'TextArea', 'Select', 'Uploader'],
                enumNames: ['Input', 'TextArea', 'Select', 'Uploader'],
              },
              name: {
                title: '字段名称',
                type: 'string',
                'ui:options': {},
              },
              label: {
                title: 'label',
                type: 'string',
                'ui:options': {},
              },
              placeholder: {
                title: 'placeholder',
                type: 'string',
                'ui:options': {},
              },
              maxLength: {
                title: 'maxLength',
                type: 'number',
              },
              minLength: {
                title: 'minLength',
                type: 'number',
              },
              required: {
                title: 'required',
                type: 'string',
                'ui:options': {},
              },
              help: {
                title: '帮助信息',
                type: 'string',
                'ui:options': {},
              },
              count: {
                title: '显示字数统计',
                type: 'boolean',
                'ui:widget': 'switch',
              },
              regular: {
                title: '正则',
                type: 'string',
                'ui:options': {},
              },
            },
          },
          'ui:options': {},
        },
      },
      'ui:displayType': 'row',
      'ui:showDescIcon': true,
    },
    preview: {
      title: '哈哈哈',
      description: 'ksjfdfhdfhdkfjd',
      img: [
        'https://fastly.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg',
        'https://s1.ax1x.com/2023/04/16/p9CenKS.jpg',
      ],
    },
    template: '',
  },
  {
    path: '3',
    name: '3',
    model: {
      schema: {
        type: 'object',
        properties: {
          string: { title: '字符串', type: 'string' },
          select: {
            title: '单选',
            type: 'string',
            enum: ['a', 'b', 'c'],
            enumNames: ['选项1', '选项2', '选项3'],
          },
        },
      },
      formData: { string: '', select: 'a' },
    },
    schema: {
      type: 'object',
      properties: {
        string: { title: '字符串', type: 'string' },
        select: {
          title: '单选',
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumNames: ['选项1', '选项2', '选项3'],
        },
      },
    },
    preview: {
      title: '哈哈哈',
      description: 'ksjfdfhdfhdkfjd',
      img: [
        'https://fastly.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg',
        'https://s1.ax1x.com/2023/04/16/p9CenKS.jpg',
      ],
    },
    template: '',
  },
  {
    path: '4',
    name: '4',
    model: {
      schema: {
        type: 'object',
        properties: {
          string: { title: '字符串', type: 'string' },
          select: {
            title: '单选',
            type: 'string',
            enum: ['a', 'b', 'c'],
            enumNames: ['选项1', '选项2', '选项3'],
          },
        },
      },
      formData: { string: '', select: 'a' },
    },
    schema: {
      type: 'object',
      properties: {
        string: { title: '字符串', type: 'string' },
        select: {
          title: '单选',
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumNames: ['选项1', '选项2', '选项3'],
        },
      },
    },
    preview: {
      title: '哈哈哈',
      description: 'ksjfdfhdfhdkfjd',
      img: [
        'https://fastly.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg',
        'https://s1.ax1x.com/2023/04/16/p9CenKS.jpg',
      ],
    },
    template: '',
  },
  {
    path: '5',
    name: '5',
    model: {
      schema: {
        type: 'object',
        properties: {
          string: { title: '字符串', type: 'string' },
          select: {
            title: '单选',
            type: 'string',
            enum: ['a', 'b', 'c'],
            enumNames: ['选项1', '选项2', '选项3'],
          },
        },
      },
      formData: { string: '', select: 'a' },
    },
    schema: {
      type: 'object',
      properties: {
        string: { title: '字符串', type: 'string' },
        select: {
          title: '单选',
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumNames: ['选项1', '选项2', '选项3'],
        },
      },
    },
    preview: {
      title: '哈哈哈',
      description: 'ksjfdfhdfhdkfjd',
      img: [
        'https://fastly.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg',
        'https://s1.ax1x.com/2023/04/16/p9CenKS.jpg',
      ],
    },
    template: '',
  },
];
