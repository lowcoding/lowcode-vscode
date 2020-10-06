import React, { useEffect, useState } from 'react';
import {
  Button,
  message,
  Select,
  Form,
  Space,
  Dropdown,
  Menu,
  notification,
  Progress,
} from 'antd';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import FormRender from 'form-render/lib/antd';
import * as codemirror from 'codemirror';
require('script-loader!jsonlint');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/addon/lint/lint.js');
//require('codemirror/addon/lint/javascript-lint.js');
require('codemirror/addon/lint/json-lint.js');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/monokai.css');
require('codemirror/addon/lint/lint.css');
import { callVscode } from '@/webview';
import YapiModal from '@/components/YapiModal';
import SelectDirectory from '@/components/SelectDirectory';

const { Option } = Select;

let schemaCodeMirror: CodeMirror.EditorFromTextArea,
  modelCodeMirror: CodeMirror.EditorFromTextArea;

export default () => {
  const [selectedMaterial, setSelectedMaterial] = useState<{
    path: string;
    name: string;
    model: string;
    schema: string;
  }>({} as any);
  const [materials, setMaterials] = useState<typeof selectedMaterial[]>([]);
  const [formData, setData] = useState({});
  const [yapiModalVsible, setYapiModalVsible] = useState(false);
  const [directoryModalVsible, setDirectoryModalVsible] = useState(false);
  useEffect(() => {
    schemaCodeMirror = codemirror.fromTextArea(
      document.getElementById('schemaCodeMirror') as any,
      {
        //lineNumbers: true,
        mode: 'application/json',
        // gutters: ['CodeMirror-lint-markers'],
        lint: true,
        theme: 'monokai',
      },
    );
    modelCodeMirror = codemirror.fromTextArea(
      document.getElementById('modelCodeMirror') as any,
      {
        //lineNumbers: true,
        mode: 'application/json',
        // gutters: ['CodeMirror-lint-markers'],
        lint: true,
        theme: 'monokai',
      },
    );
    callVscode({ cmd: 'getLocalMaterials', data: 'blocks' }, data => {
      setMaterials(data);
    });
  }, []);
  useEffect(() => {
    if (selectedMaterial.schema) {
      schemaCodeMirror.setValue(
        JSON.stringify(JSON.parse(selectedMaterial.schema), null, 2),
      );
    }
    if (selectedMaterial.model) {
      modelCodeMirror.setValue(
        JSON.stringify(JSON.parse(selectedMaterial.model), null, 2),
      );
    }
  }, [selectedMaterial]);

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setYapiModalVsible(true);
        }}
      >
        根据 YAPI 接口追加模板数据
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Form
        {...{
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }}
      >
        <Form.Item label="模板">
          <Select
            placeholder="选择模板"
            onChange={value => {
              const selected = materials.find(s => s.path === value);
              setSelectedMaterial(selected!);
            }}
          >
            {materials.map(s => {
              return (
                <Option value={s.path} key={s.path}>
                  {s.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="模板 Schema"
          style={{ display: selectedMaterial.path ? 'flex' : 'none' }}
        >
          <textarea id="schemaCodeMirror"></textarea>
          <br></br>
          {selectedMaterial.schema && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                const schemaStr = schemaCodeMirror.getValue();
                try {
                  JSON.parse(schemaStr);
                  setSelectedMaterial(s => {
                    return {
                      ...s,
                      schema: schemaStr,
                    };
                  });
                } catch {
                  message.error('schema 格式不对');
                }
                setData({});
              }}
            >
              重新构建 Schema 表单
            </Button>
          )}
        </Form.Item>
        {selectedMaterial.schema && (
          <Form.Item label="Schema 表单">
            <div style={{ padding: '24px' }}>
              <FormRender
                schema={JSON.parse(selectedMaterial.schema)}
                formData={formData}
                onChange={setData}
                showValidate={false}
              />
              <br></br>
              <Space>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setSelectedMaterial(s => {
                      return {
                        ...s,
                        model: JSON.stringify(formData),
                      };
                    });
                  }}
                >
                  生成模板数据
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    const modelStr = modelCodeMirror.getValue();
                    try {
                      const model = JSON.parse(modelStr);
                      setSelectedMaterial(s => {
                        return {
                          ...s,
                          model: JSON.stringify({ ...model, ...formData }),
                        };
                      });
                    } catch {
                      message.error('model 格式不对');
                    }
                  }}
                >
                  追加模板数据
                </Button>
              </Space>
            </div>
          </Form.Item>
        )}
        <Form.Item
          label="模板数据"
          style={{ display: selectedMaterial.path ? 'flex' : 'none' }}
        >
          <textarea id="modelCodeMirror"></textarea>
          <br></br>
          <Space>
            <Dropdown overlay={menu}>
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
                setDirectoryModalVsible(true);
              }}
            >
              生成代码
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <YapiModal
        visible={yapiModalVsible}
        onOk={model => {
          const modelStr = modelCodeMirror.getValue();
          try {
            const oriModel = JSON.parse(modelStr);
            setSelectedMaterial(s => {
              return {
                ...s,
                model: JSON.stringify({ ...oriModel, ...model }),
              };
            });
            setYapiModalVsible(false);
          } catch {
            message.error('model 格式不对');
          }
        }}
        onCancel={() => {
          setYapiModalVsible(false);
        }}
      />
      <SelectDirectory
        visible={directoryModalVsible}
        onCancel={() => {
          setDirectoryModalVsible(false);
        }}
        onOk={(path, createPath = []) => {
          setDirectoryModalVsible(false);
          notification.open({
            key: path,
            message: '正在生成',
            description: (
              <div style={{ textAlign: 'center' }}>
                <LoadingOutlined
                  style={{ fontSize: '40px', color: '#1890ff' }}
                />
              </div>
            ),
            duration: 0,
            placement: 'bottomRight',
          });
          callVscode(
            {
              cmd: 'genCodeByBlockMaterial',
              data: {
                material: selectedMaterial.name,
                model: JSON.parse(modelCodeMirror.getValue()),
                path: path,
                createPath: createPath,
              },
            },
            () => {
              notification.open({
                key: path,
                message: '生成成功',
                description: (
                  <div style={{ textAlign: 'center' }}>
                    <Progress type="circle" percent={100} width={40} />
                  </div>
                ),
                duration: 4.5,
                placement: 'bottomRight',
              });
            },
          );
        }}
      />
    </div>
  );
};
