import React from 'react';
import { Button, message, Form, Space, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import FormRender, { useForm } from 'form-render';
import { history } from 'umi';
import YapiModal from '@/components/YapiModal';
import SelectDirectory from '@/components/SelectDirectory';
import CodeMirror from '@/components/CodeMirror';
import JsonToTs from '@/components/JsonToTs';
import useController from './useController';
import { genCodeByBlockMaterial } from '@/webview/service';

export default () => {
  const controller = useController();
  const { service } = controller;
  const { model } = service;

  return (
    <div>
      <Form layout="vertical">
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
                form={controller.form}
                schema={model.selectedMaterial.schema}
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
                model.setDirectoryModalVsible(true);
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
            history.push('/blocks');
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
      <SelectDirectory
        visible={model.directoryModalVsible}
        onCancel={() => {
          model.setDirectoryModalVsible(false);
        }}
        onOk={(path, createPath = []) => {
          model.setDirectoryModalVsible(false);
          genCodeByBlockMaterial({
            material: model.selectedMaterial.name,
            model: model.selectedMaterial.model,
            path: path,
            createPath: createPath,
          }).then(() => {
            message.success('生成成功');
          });
        }}
      />
      <JsonToTs
        visible={model.jsonToTsModalVisble}
        json={model.selectedMaterial}
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
    </div>
  );
};
