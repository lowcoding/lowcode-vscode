import { defineComponent, PropType, reactive, watch } from 'vue';
import { Modal, Form, TreeSelect, Select, message } from 'ant-design-vue';
import { getDirectoryTree } from '../../vscode/service';

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
    ?.filter((s) => s.type === 'directory')
    .map((s) => {
      return formatTreeData(s);
    });
  return formatedNode;
};

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onCancel: Function as PropType<() => void>,
    onOk: Function as PropType<(path: string, createPath: string[]) => void>,
  },
  emits: ['cancel', 'ok'],
  setup(props, context) {
    const tree = reactive<{ data: DirectoryTreeNode[] }>({ data: [] });
    const formData = reactive<{
      data: {
        path: string;
        createPath: string[];
      };
    }>({ data: {} as any });
    watch(
      () => props.visible,
      () => {
        if (props.visible) {
          getDirectoryTree().then((res) => {
            const formatedTree = res.children
              ?.filter((s) => s.type === 'directory')
              .map((s) => {
                return formatTreeData(s);
              });
            tree.data = formatedTree || [];
            formData.data = {} as any;
          });
        }
      },
    );

    return () => (
      <Modal
        title="选择模块生成目录"
        visible={props.visible}
        closable={false}
        okText="确定"
        cancelText="关闭"
        onCancel={() => {
          context.emit('cancel');
        }}
        onOk={() => {
          if (!formData.data.path) {
            message.error('未选择目录');
            return;
          }
          context.emit('ok', formData.data.path, formData.data.createPath);
        }}
      >
        {() => (
          <Form layout="vertical">
            {() => (
              <>
                <Form.Item label="选择目录" required>
                  {() => (
                    <TreeSelect
                      treeData={tree.data}
                      placeholder="选择"
                      showSearch
                      treeNodeLabelProp="value"
                      value={formData.data.path}
                      onSelect={(value) => {
                        formData.data.path = value;
                      }}
                    />
                  )}
                </Form.Item>
                <Form.Item label="区块名称">
                  {() => (
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      value={formData.data.createPath}
                      placeholder="与上面选择的目录合成最终生成代码的目录，输入多个则生成层级目录"
                      onChange={(value) => {
                        formData.data.createPath = value;
                      }}
                      notFoundContent={null}
                    />
                  )}
                </Form.Item>
              </>
            )}
          </Form>
        )}
      </Modal>
    );
  },
});
