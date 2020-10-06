import React, { useEffect, useState } from 'react';
import { Modal, Form, TreeSelect, Select, message } from 'antd';
import { callVscode } from '@/webview';
interface Iprops {
  visible: boolean;
  onCancel: () => void;
  onOk: (path: string, createPath: string[]) => void;
}

type DirectoryTreeNode = {
  title: string;
  value: string;
  children?: DirectoryTreeNode[];
};

type OriDirectoryTreeNode = {
  path: string;
  name: string;
  size: number;
  extension: string;
  type: 'file' | 'directory';
  children?: OriDirectoryTreeNode[];
};

const formatTreeData = (node: OriDirectoryTreeNode) => {
  let formatedNode: DirectoryTreeNode = {
    title: node.name,
    value: node.path,
  };
  formatedNode.children = node.children
    ?.filter(s => s.type === 'directory')
    .map(s => {
      return formatTreeData(s);
    });
  return formatedNode;
};

const SelectDirectory: React.FC<Iprops> = ({ visible, onOk, onCancel }) => {
  const [tree, setTree] = useState<DirectoryTreeNode[]>([]);
  const [formData, setFormData] = useState<{
    path: string;
    createPath: string[];
  }>({} as any);
  useEffect(() => {
    if (visible) {
      callVscode({ cmd: 'getDirectoryTree' }, (data: OriDirectoryTreeNode) => {
        const formatedTree = data.children
          ?.filter(s => s.type === 'directory')
          .map(s => {
            return formatTreeData(s);
          });
        setTree(formatedTree || []);
      });
    }
    setFormData({} as any);
  }, [visible]);

  return (
    <Modal
      title="选择模块生成目录"
      visible={visible}
      closable={false}
      okText="确定"
      cancelText="关闭"
      onCancel={() => {
        onCancel();
      }}
      onOk={() => {
        if (!formData.path) {
          message.error('未选择目录');
          return;
        }
        onOk(formData.path, formData.createPath);
      }}
    >
      <Form
        {...{
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
        }}
      >
        <Form.Item label="选择目录" required>
          <TreeSelect
            treeData={tree}
            placeholder="选择"
            treeDefaultExpandAll
            showSearch
            treeNodeLabelProp="value"
            value={formData.path}
            onSelect={value => {
              setFormData(s => {
                return {
                  ...s,
                  path: value as string,
                };
              });
            }}
          />
        </Form.Item>
        <Form.Item label="区块名称">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            value={formData.createPath}
            placeholder="与上面选择的目录合成最终生成代码的目录，输入多个则生成层级目录"
            onChange={value => {
              setFormData(s => {
                return {
                  ...s,
                  createPath: value,
                };
              });
            }}
            notFoundContent={null}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SelectDirectory;
