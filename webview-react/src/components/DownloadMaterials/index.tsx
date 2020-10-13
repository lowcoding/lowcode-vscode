import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, message, notification } from 'antd';
import { callVscode } from '@/webview';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}
const DownloadMaterials: React.FC<IProps> = ({ visible, onCancel, onOk }) => {
  const [formData, setFormData] = useState<{
    type: 'git' | 'npm';
    url: string;
  }>({} as any);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (visible) {
      setFormData({} as any);
    }
  }, [visible]);

  return (
    <Modal
      width={650}
      visible={visible}
      title="下载物料"
      onCancel={() => {
        if (processing) {
          return;
        }
        onCancel();
      }}
      onOk={() => {
        if (!formData.type || !formData.url) {
          message.error('请完善信息');
          return;
        }
        setProcessing(true);
        callVscode(
          {
            cmd: 'downloadMaterials',
            data: { type: formData.type, url: formData.url },
          },
          () => {
            notification.success({
              message: '下载成功',
              description: '关闭当前标签后重新打开即可',
              placement: 'bottomRight',
            });
            setProcessing(false);
            onOk();
          },
          () => {
            setProcessing(false);
          },
        );
      }}
      okText="确定"
      cancelText="取消"
      okButtonProps={{ disabled: processing, loading: processing }}
    >
      <Form
        {...{
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
        }}
      >
        <Form.Item label="类型" required>
          <Select
            placeholder="请选择"
            value={formData.type}
            onChange={value => {
              setFormData(s => {
                return {
                  ...s,
                  url: '',
                  type: value,
                };
              });
            }}
          >
            <Select.Option value="git">git仓库</Select.Option>
            <Select.Option value="npm">npm包</Select.Option>
          </Select>
        </Form.Item>
        {formData.type && (
          <Form.Item
            label={formData.type === 'git' ? '仓库地址' : '包名称'}
            required
          >
            <Select
              mode="tags"
              placeholder={`输入${
                formData.type === 'git' ? 'git仓库地址' : 'npm包名称'
              }或选择默认模板`}
              value={formData.url ? [formData.url] : undefined}
              onChange={value => {
                setFormData(s => {
                  return {
                    ...s,
                    url: value && value.length ? value[value.length - 1] : '',
                  };
                });
              }}
            >
              {formData.type === 'git' && (
                <>
                  <Select.Option value="https://gitee.com/lowcoding/lowcode-materials-template.git">
                    https://gitee.com/lowcoding/lowcode-materials-template.git(国内镜像)
                  </Select.Option>
                  <Select.Option value="https://github.com/lowcoding/lowcode-materials-template.git">
                    https://github.com/lowcoding/lowcode-materials-template.git
                  </Select.Option>
                </>
              )}
              {formData.type === 'npm' && (
                <Select.Option value="@lowcoding/materials-template">
                  @lowcoding/materials-template
                </Select.Option>
              )}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
export default DownloadMaterials;
