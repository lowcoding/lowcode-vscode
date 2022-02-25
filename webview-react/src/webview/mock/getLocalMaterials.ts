export default [
  {
    path: '1',
    name: 'hahah  ahahahah1',
    model: {
      string: '',
      select: 'a',
    },
    schema: {
      type: 'object',
      properties: {
        name: {
          title: '名称',
          type: 'string',
          'ui:options': {},
        },
        filters: {
          title: '查询条件',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                title: 'type',
                type: 'string',
                enum: ['input', 'select'],
                enumNames: ['input', 'select'],
              },
              prop: {
                title: 'prop',
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
              block: {
                title: 'block',
                type: 'boolean',
                'ui:widget': 'switch',
              },
              disabled: {
                title: 'disabled',
                type: 'boolean',
                'ui:widget': 'switch',
              },
            },
          },
        },
        columns: {
          title: '表格',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: {
                title: 'title',
                type: 'string',
                'ui:options': {},
              },
              dataIndex: {
                title: 'dataIndex',
                type: 'string',
                'ui:options': {},
              },
              width: {
                title: 'width',
                type: 'number',
                'ui:options': {},
              },
              type: {
                title: 'type',
                type: 'string',
                enum: [
                  '',
                  'text',
                  'button',
                  'tag-prop',
                  'clickable',
                  'tag-list',
                  'html',
                  'time',
                ],
                enumNames: [
                  '默认',
                  'text',
                  'button',
                  'tag-prop',
                  'clickable',
                  'tag-list',
                  'html',
                  'time',
                ],
              },
              ellipsis: {
                title: 'ellipsis',
                type: 'boolean',
                'ui:widget': 'switch',
              },
            },
          },
        },
      },
    },
    preview: {
      title: '哈哈哈',
      description: 'ksjfdfhdfhdkfjd',
      img:
        'https://gitee.com/img-host/img-host/raw/master//2020/11/05/1604587962875.jpg',
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
      img:
        'https://gitee.com/img-host/img-host/raw/master//2020/11/05/1604587962875.jpg',
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
      img:
        'https://gitee.com/img-host/img-host/raw/master//2020/11/05/1604587962875.jpg',
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
      img:
        'https://gitee.com/img-host/img-host/raw/master//2020/11/05/1604587962875.jpg',
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
      img:
        'https://gitee.com/img-host/img-host/raw/master//2020/11/05/1604587962875.jpg',
    },
    template: '',
  },
];
