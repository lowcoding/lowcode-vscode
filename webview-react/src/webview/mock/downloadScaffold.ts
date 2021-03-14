export default {
  formSchema: {
    schema: {
      type: 'object',
      properties: {
        noREADME: {
          title: '移除README文件',
          type: 'boolean',
          'ui:widget': 'switch',
          'ui:width': '100%',
          'ui:labelWidth': 0,
        },
        emptyREADME: {
          title: '空README文件',
          type: 'boolean',
          'ui:widget': 'switch',
        },
      },
      'ui:displayType': 'row',
      'ui:showDescIcon': true,
    },
    displayType: 'row',
    showDescIcon: true,
    labelWidth: 158,
    formData: {
      noREADME: false,
      emptyREADME: false,
    },
  },
  excludeCompile: ['codeTemplate/', 'materials/'],
  conditionFiles: {
    noREADME: {
      value: true,
      exclude: ['README.md.ejs'],
    },
  },
};
