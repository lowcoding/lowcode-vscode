import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Input } from 'antd';
import { callVscode } from '@/webview';

interface IProps {
  visible: boolean;
  onOk: (model: any) => void;
  onCancel: () => void;
}

const YapiModal: React.FC<IProps> = ({ visible, onCancel, onOk }) => {
  const [projects, setProjects] = useState<
    { name: string; token: string; domain: string }[]
  >([]);
  const [domain, setDomain] = useState('');
  const [formData, setFormData] = useState<{
    token: string;
    id: string;
    funName: string;
    typeName: string;
  }>({
    funName: 'fetch',
    typeName: 'IFetchResult',
  } as any);
  useEffect(() => {
    if (visible) {
      callVscode({ cmd: 'getYapiDomain' }, (data) => {
        setDomain(data);
      });
      callVscode({ cmd: 'getYapiProjects' }, (data) => {
        setProjects(data);
      });
    }
  }, [visible]);
  const genModel = () => {
    callVscode(
      {
        cmd: 'genTemplateModelByYapi',
        data: {
          domain,
          id: formData.id,
          token: formData.token,
          typeName: formData.typeName ? formData.typeName : undefined,
          funName: formData.funName ? formData.funName : undefined,
        },
      },
      (model) => {
        setFormData({} as any);
        onOk(model);
      },
    );
  };
  return (
    <Modal
      title="根据 YAPI 接口追加模板数据"
      visible={visible}
      closable={false}
      okText="确定"
      cancelText="关闭"
      onCancel={() => {
        setFormData({} as any);
        onCancel();
      }}
      onOk={() => {
        genModel();
      }}
    >
      <Form layout="vertical">
        <Form.Item label="项目" required>
          <Select
            placeholder="请选择项目"
            onChange={(value) => {
              const selected = projects.find((s) => s.token === value);
              setFormData((s) => ({
                ...s,
                token: selected!.token,
              }));
              if (selected?.domain) {
                setDomain(selected?.domain);
              }
            }}
            value={formData.token}
          >
            {projects.map((s) => (
              <Select.Option value={s.token} key={s.token}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="接口ID" required>
          <Input
            placeholder="输入 yapi 接口ID"
            value={formData.id}
            onChange={(e) => {
              const value = e.target.value;
              setFormData((s) => ({
                ...s,
                id: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item label="接口函数名称">
          <Input
            placeholder="输入生成的接口请求函数名称"
            value={formData.funName}
            onChange={(e) => {
              const value = e.target.value;
              setFormData((s) => ({
                ...s,
                funName: value,
              }));
            }}
            onBlur={() => {
              if (formData.funName && formData.funName.length > 1) {
                setFormData((s) => ({
                  ...s,
                  typeName: `I${
                    formData.funName.charAt(0).toUpperCase() +
                    formData.funName.slice(1)
                  }Result`,
                }));
              }
            }}
          />
        </Form.Item>
        <Form.Item label="类型名称">
          <Input
            placeholder="输入生成的TS类型名称"
            value={formData.typeName}
            onChange={(e) => {
              const value = e.target.value;
              setFormData((s) => ({
                ...s,
                typeName: value,
              }));
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default YapiModal;
