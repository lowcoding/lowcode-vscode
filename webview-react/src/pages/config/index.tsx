import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import FormRender from 'form-render/lib/antd';
import useController from './useController';
import { savePluginConfig } from '@/webview/service';
const schame = {
  type: 'object',
  properties: {
    yapi: {
      title: 'yapi配置',
      type: 'object',
      properties: {
        domain: {
          title: '域名',
          type: 'string',
          description: '',
          'ui:labelWidth': 146,
          'ui:readonly': false,
          'ui:options': {},
        },
        projects: {
          title: '项目列表',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                title: '名称',
                type: 'string',
                'ui:labelWidth': 0,
                'ui:options': {},
              },
              token: {
                title: 'token',
                type: 'string',
                'ui:options': {},
              },
              domain: {
                title: '域名',
                type: 'string',
                description: '单独定义 yapi 项目的域名',
                'ui:options': {},
              },
            },
          },
          'ui:options': {},
        },
      },
    },
    mock: {
      title: 'mock 配置',
      type: 'object',
      properties: {
        mockNumber: {
          title: '模拟number数据',
          type: 'string',
          'ui:options': {},
        },
        mockBoolean: {
          title: '模拟boolean数据',
          type: 'string',
          'ui:labelWidth': 0,
          'ui:options': {},
        },
        mockString: {
          title: '模拟string数据',
          type: 'string',
          'ui:options': {},
        },
        mockKeyWordEqual: {
          title: '模拟关键词-全等匹配',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: {
                title: '关键字',
                type: 'string',
                'ui:width': '50%',
                'ui:options': {},
              },
              value: {
                title: '替换为',
                type: 'string',
                'ui:width': '50%',
                'ui:options': {},
              },
            },
          },
          'ui:options': {},
        },
        mockKeyWordLike: {
          title: '模拟关键词-相似匹配',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: {
                title: '关键字',
                type: 'string',
                'ui:width': '50%',
                'ui:options': {},
              },
              value: {
                title: '替换为',
                type: 'string',
                'ui:width': '50%',
                'ui:options': {},
              },
            },
          },
          'ui:options': {},
        },
      },
    },
    saveOption: {
      title: '保存位置',
      description: '至少选择一项',
      type: 'array',
      items: {
        type: 'string',
      },
      enum: ['package', 'vscode'],
      enumNames: ['当前项目package.json文件（建议）', 'vscode配置'],
    },
  },
};
export default () => {
  const controller = useController();
  const { service } = controller;
  const { model } = service;

  return (
    <div>
      <FormRender
        displayType="column"
        showDescIcon={true}
        labelWidth={170}
        column={1}
        schema={schame}
        formData={model.formData}
        onChange={model.setFormDate}
        showValidate={false}
      />
      <div style={{ textAlign: 'center' }}>
        <Button
          shape="round"
          type="primary"
          onClick={() => {
            savePluginConfig(model.formData).then(() => {
              message.success('保存成功');
            });
          }}
        >
          保存
        </Button>
      </div>
    </div>
  );
};
