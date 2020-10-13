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
import FormRender from 'form-render/lib/antd';
import { history, useParams } from 'umi';
import { callVscode } from '@/webview';
import YapiModal from '@/components/YapiModal';
import SelectDirectory from '@/components/SelectDirectory';
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
  const [materials, setMaterials] = useState<typeof selectedMaterial[]>([]);
  const [formData, setData] = useState({});
  const [yapiModalVsible, setYapiModalVsible] = useState(false);
  const [directoryModalVsible, setDirectoryModalVsible] = useState(false);
  const [jsonToTsModalVisble, setJsonToTsModalVisble] = useState(false);
  const params = useParams<{ name: string }>();
  useEffect(() => {
    callVscode({ cmd: 'getLocalMaterials', data: 'blocks' }, data => {
      setMaterials(data);
      if (data.length) {
        const selected = data.find((s: any) => s.name === params.name);
        setSelectedMaterial(selected!);
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
                setDirectoryModalVsible(true);
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
                model: selectedMaterial.model,
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
    </div>
  );
};
