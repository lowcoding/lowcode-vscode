import React, { useEffect, useState } from 'react';
import { Button, Form, Space, Dropdown, message, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { history } from 'umi';
import FormRender from 'form-render';
import YapiModal from '@/components/YapiModal';
import CodeMirror from '@/components/CodeMirror';
import JsonToTs from '@/components/JsonToTs';
import useController from './useController';
import { genCodeBySnippetMaterial } from '@/webview/service';

export default () => {
  const controller = useController();
  const { service } = controller;
  const { model } = service;

  return (
    <div>
      <Form layout="vertical">
        <Form.Item
          label="模板"
          style={{ display: model.selectedMaterial.path ? 'flex' : 'none' }}
        >
          <CodeMirror
            domId="templateCodeMirror"
            lint={false}
            value={model.selectedMaterial.template}
            onChange={value => {
              model.setSelectedMaterial(s => {
                return {
                  ...s,
                  template: value,
                };
              });
            }}
          />
        </Form.Item>
        {/* <Form.Item
          label="模板 Schema"
          style={{ display: model.selectedMaterial.path ? 'flex' : 'none' }}
        >
          <CodeMirror
            domId="schemaCodeMirror"
            lint
            value={JSON.stringify(model.selectedMaterial.schema, null, 2)}
            onChange={value => {
              model.setSelectedMaterial(s => {
                return {
                  ...s,
                  schema: JSON.parse(value),
                };
              });
            }}
          />
        </Form.Item> */}
        {Object.keys(model.selectedMaterial.schema).length > 0 && (
          <Form.Item label="Schema 表单">
            <div style={{ padding: '24px' }}>
              <FormRender
                schema={model.selectedMaterial.schema}
                form={controller.form}
                watch={controller.watch}
              />
              <br></br>
              <Space>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    model.setSelectedMaterial(s => {
                      return {
                        ...s,
                        model: model.formData,
                      };
                    });
                  }}
                >
                  重新生成模板数据
                </Button>
              </Space>
            </div>
          </Form.Item>
        )}
        <Form.Item
          label="模板数据"
          style={{ display: model.selectedMaterial.path ? 'flex' : 'none' }}
        >
          <CodeMirror
            domId="modelCodeMirror"
            lint
            value={JSON.stringify(model.selectedMaterial.model, null, 2)}
            onChange={value => {
              model.setSelectedMaterial(s => {
                return {
                  ...s,
                  model: JSON.parse(value),
                };
              });
            }}
          />
          <br></br>
          <Space>
            <Dropdown overlay={controller.menu}>
              <a
                className="ant-dropdown-link"
                onClick={e => e.preventDefault()}
              >
                更多功能 <DownOutlined />
              </a>
            </Dropdown>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                genCodeBySnippetMaterial({
                  model: model.selectedMaterial.model,
                  template: model.selectedMaterial.template,
                }).then(() => {
                  message.success('生成成功');
                });
              }}
            >
              生成代码
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Button
          shape="round"
          onClick={() => {
            history.push('/snippets');
          }}
          style={{ width: '50%' }}
        >
          返回
        </Button>
      </div>
      <YapiModal
        visible={model.yapiModalVsible}
        onOk={m => {
          model.setSelectedMaterial(s => {
            return {
              ...s,
              model: { ...model.selectedMaterial.model, ...m },
            };
          });
          model.setYapiModalVsible(false);
        }}
        onCancel={() => {
          model.setYapiModalVsible(false);
        }}
      />
      <JsonToTs
        visible={model.jsonToTsModalVisble}
        json={model.selectedMaterial.model}
        onCancel={() => {
          model.setJsonToTsModalVisble(false);
        }}
        onOk={type => {
          model.setSelectedMaterial(s => {
            return {
              ...s,
              model: { ...model.selectedMaterial.model, type: type },
            };
          });
          model.setJsonToTsModalVisble(false);
        }}
      />
      <Modal
        visible={model.templateModalVisble}
        title="编辑模板"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          model.setTemplateModalVisble(false);
        }}
        onOk={() => {
          model.setTemplateModalVisble(false);
        }}
      >
        <CodeMirror
          domId="templateCodeMirrorDialog"
          lint={false}
          value={model.selectedMaterial.template}
          onChange={value => {
            model.setSelectedMaterial(s => {
              return {
                ...s,
                template: value,
              };
            });
          }}
        />
      </Modal>
    </div>
  );
};
