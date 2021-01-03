import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Space,
  Dropdown,
  Menu,
  notification,
  Progress,
  Modal,
} from 'antd';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { history, useParams } from 'umi';
import FormRender from 'form-render/lib/antd';
import { callVscode } from '@/webview';
import YapiModal from '@/components/YapiModal';
import CodeMirror from '@/components/CodeMirror';
import JsonToTs from '@/components/JsonToTs';

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
  }>({ schema: {}, model: {} } as any);
  const [formData, setData] = useState({});
  const [yapiModalVsible, setYapiModalVsible] = useState(false);
  const [templateModalVisble, setTemplateModalVisble] = useState(false);
  const [jsonToTsModalVisble, setJsonToTsModalVisble] = useState(false);
  const params = useParams<{ name: string }>();
  useEffect(() => {
    callVscode({ cmd: 'getLocalMaterials', data: 'snippets' }, data => {
      if (data.length) {
        const selected = data.find((s: any) => s.name === params.name);
        setSelectedMaterial(selected!);
        setData(selectedMaterial.model);
      }
    });
  }, []);

  useEffect(() => {
    setSelectedMaterial(s => {
      return {
        ...s,
        model: { ...s.model, ...formData },
      };
    });
  }, [formData]);

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setJsonToTsModalVisble(true);
        }}
      >
        JSON TO TS
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setYapiModalVsible(true);
        }}
      >
        根据 YAPI 接口追加模板数据
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setTemplateModalVisble(true);
        }}
      >
        编辑模板
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Form layout="vertical">
        <Form.Item
          label="模板"
          style={{ display: selectedMaterial.path ? 'flex' : 'none' }}
        >
          <CodeMirror
            domId="templateCodeMirror"
            lint={false}
            value={selectedMaterial.template}
            onChange={value => {
              setSelectedMaterial(s => {
                return {
                  ...s,
                  template: value,
                };
              });
            }}
          />
        </Form.Item>
        <Form.Item
          label="模板 Schema"
          style={{ display: selectedMaterial.path ? 'flex' : 'none' }}
        >
          <CodeMirror
            domId="schemaCodeMirror"
            lint
            value={JSON.stringify(selectedMaterial.schema, null, 2)}
            onChange={value => {
              setSelectedMaterial(s => {
                return {
                  ...s,
                  schema: JSON.parse(value),
                };
              });
            }}
          />
        </Form.Item>
        {Object.keys(selectedMaterial.schema).length > 0 && (
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
                  重新生成模板数据
                </Button>
              </Space>
            </div>
          </Form.Item>
        )}
        <Form.Item
          label="模板数据"
          style={{ display: selectedMaterial.path ? 'flex' : 'none' }}
        >
          <CodeMirror
            domId="modelCodeMirror"
            lint
            value={JSON.stringify(selectedMaterial.model, null, 2)}
            onChange={value => {
              setSelectedMaterial(s => {
                return {
                  ...s,
                  model: JSON.parse(value),
                };
              });
            }}
          />
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
                      model: selectedMaterial.model,
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
          setSelectedMaterial(s => {
            return {
              ...s,
              model: { ...selectedMaterial.model, ...model },
            };
          });
          setYapiModalVsible(false);
        }}
        onCancel={() => {
          setYapiModalVsible(false);
        }}
      />
      <JsonToTs
        visible={jsonToTsModalVisble}
        json={selectedMaterial.model}
        onCancel={() => {
          setJsonToTsModalVisble(false);
        }}
        onOk={type => {
          setSelectedMaterial(s => {
            return {
              ...s,
              model: { ...selectedMaterial.model, type: type },
            };
          });
          setJsonToTsModalVisble(false);
        }}
      />
      <Modal
        visible={templateModalVisble}
        title="编辑模板"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setTemplateModalVisble(false);
        }}
        onOk={() => {
          setTemplateModalVisble(false);
        }}
      >
        <CodeMirror
          domId="templateCodeMirrorDialog"
          lint={false}
          value={selectedMaterial.template}
          onChange={value => {
            setSelectedMaterial(s => {
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
