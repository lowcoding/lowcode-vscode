import React, { useEffect, useState } from 'react';
import {
  Button,
  message,
  Form,
  Space,
  Dropdown,
  Menu,
  notification,
  Progress,
} from 'antd';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { history, useParams } from 'umi';
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

let schemaCodeMirror: CodeMirror.EditorFromTextArea,
  modelCodeMirror: CodeMirror.EditorFromTextArea;

export default () => {
  const [selectedMaterial, setSelectedMaterial] = useState<{
    path: string;
    name: string;
    model: object;
    schema: object;
    preview: {
      title: string;
      description: string;
      img: string;
    };
    template: string;
  }>({} as any);
  const [materials, setMaterials] = useState<typeof selectedMaterial[]>([]);
  const [formData, setData] = useState({});
  const [yapiModalVsible, setYapiModalVsible] = useState(false);
  const params = useParams<{ name: string }>();
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
    callVscode({ cmd: 'getLocalMaterials', data: 'snippets' }, data => {
      setMaterials(data);
      if (data.length) {
        const selected = data.find((s: any) => s.name === params.name);
        setSelectedMaterial(selected!);
      }
    });
  }, []);
  useEffect(() => {
    if (selectedMaterial.schema) {
      schemaCodeMirror.setValue(
        JSON.stringify(selectedMaterial.schema, null, 2),
      );
    }
    if (selectedMaterial.model) {
      modelCodeMirror.setValue(JSON.stringify(selectedMaterial.model, null, 2));
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
        <Form.Item label="模板">{selectedMaterial.name}</Form.Item>
        <Form.Item
          label="模板 Schema"
          style={{ display: selectedMaterial.path ? 'flex' : 'none' }}
        >
          <textarea id="schemaCodeMirror"></textarea>
          <br></br>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              const schemaStr = schemaCodeMirror.getValue();
              try {
                const schema = JSON.parse(schemaStr);
                setSelectedMaterial(s => {
                  return {
                    ...s,
                    schema: schema,
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
        </Form.Item>
        {selectedMaterial.schema && (
          <Form.Item label="Schema 表单">
            <div style={{ padding: '24px' }}>
              <FormRender
                schema={selectedMaterial.schema}
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
                        model: formData,
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
                          model: { ...model, ...formData },
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
                notification.open({
                  key: selectedMaterial.name,
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
                    cmd: 'genCodeBySnippetMaterial',
                    data: {
                      model: JSON.parse(modelCodeMirror.getValue()),
                      template: selectedMaterial.template,
                    },
                  },
                  data => {
                    notification.open({
                      key: selectedMaterial.name,
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
        visible={yapiModalVsible}
        onOk={model => {
          const modelStr = modelCodeMirror.getValue();
          try {
            const oriModel = JSON.parse(modelStr);
            setSelectedMaterial(s => {
              return {
                ...s,
                model: { ...oriModel, ...model },
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
    </div>
  );
};
