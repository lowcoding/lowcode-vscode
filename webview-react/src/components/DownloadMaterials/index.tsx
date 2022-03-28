import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, message, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { downloadMaterials, IDownloadMaterialsResult } from '@/webview/service';
import {
  fetchMaterialRepositoryList,
  IFetchMaterialRepositoryListResult,
} from './api';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (data: IDownloadMaterialsResult) => void;
}
const DownloadMaterials: React.FC<IProps> = ({ visible, onCancel, onOk }) => {
  const [repositoryList, setRepositoryList] =
    useState<IFetchMaterialRepositoryListResult>({
      git: [
        {
          title: 'lowcode默认提供的物料',
          repository:
            'https://github.com/lowcode-scaffold/lowcode-materials.git',
        },
        {
          title: 'lowcode默认提供的物料(国内镜像)',
          repository:
            'https://gitee.com/lowcode-scaffold/lowcode-materials.git',
        },
      ],
      npm: [
        {
          title: '@lowcoding/materials-template',
          repository: '@lowcoding/materials-template',
        },
      ],
    });

  const [formData, setFormData] = useState<{
    type: 'git' | 'npm';
    url: string;
  }>({} as any);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (visible) {
      setFormData({} as any);
      fetchMaterialRepositoryList().then((res) => {
        setRepositoryList(res);
      });
    }
  }, [visible]);

  return (
    <Modal
      width={650}
      visible={visible}
      title={
        <span>
          下载物料
          <Tooltip title="分享物料可提交到https://github.com/lowcoding/material">
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      }
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
        downloadMaterials({ type: formData.type, url: formData.url })
          .then((res) => {
            message.success('下载成功');
            setProcessing(false);
            onOk(res);
          })
          .finally(() => {
            setProcessing(false);
          });
      }}
      okText="确定"
      cancelText="取消"
      okButtonProps={{ disabled: processing, loading: processing }}
    >
      <Form layout="vertical">
        <Form.Item label="类型" required>
          <Select
            placeholder="请选择"
            value={formData.type}
            onChange={(value) => {
              setFormData((s) => ({
                ...s,
                url: '',
                type: value,
              }));
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
              onChange={(value) => {
                setFormData((s) => ({
                  ...s,
                  url: value && value.length ? value[value.length - 1] : '',
                }));
              }}
            >
              {formData.type === 'git' &&
                repositoryList.git.map((item) => (
                  <Select.Option value={item.repository} key={item.repository}>
                    {item.title}
                  </Select.Option>
                ))}
              {formData.type === 'npm' &&
                repositoryList.npm.map((item) => (
                  <Select.Option value={item.repository} key={item.repository}>
                    {item.title}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
export default DownloadMaterials;
