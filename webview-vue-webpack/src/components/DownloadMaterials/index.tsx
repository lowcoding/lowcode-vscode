import { defineComponent, PropType, reactive, ref, watch } from 'vue';
import { Modal, Form, Select, message } from 'ant-design-vue';
import useHeaderControlTab from '../../model/headerControlTab';
import useRefreshPage from '../../model/refreshPage';
import { downloadMaterials } from '../../vscode/service';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onOk: Function as PropType<() => void>,
    onCancel: Function as PropType<() => void>,
  },
  emits: ['ok', 'cancel'],
  setup(props, context) {
    const { tab } = useHeaderControlTab();
    const { toggleRefresh } = useRefreshPage();
    const formData = reactive<{
      data: { type: 'git' | 'npm'; url: string };
    }>({ data: {} as any });
    const processing = ref(false);
    watch(
      () => props.visible,
      () => {
        if (props.visible) {
          formData.data = {} as any;
        }
      },
    );
    return () => (
      <Modal
        width={650}
        visible={props.visible}
        title="下载物料"
        onCancel={() => {
          if (processing.value) {
            return;
          }
          context.emit('cancel');
        }}
        onOk={() => {
          if (!formData.data.type || !formData.data.url) {
            message.error('请完善信息');
            return;
          }
          processing.value = true;
          downloadMaterials({
            type: formData.data.type,
            url: formData.data.url,
          })
            .then(() => {
              message.success('下载成功');
              context.emit('ok');
              if (tab.value === '/snippets' || tab.value === '/blocks') {
                toggleRefresh();
              }
            })
            .finally(() => {
              processing.value = false;
            });
        }}
        okText="确定"
        cancelText="取消"
        okButtonProps={
          { disabled: processing.value, loading: processing.value } as any
        }
      >
        <Form layout="vertical">
          <Form.Item label="类型" required>
            {() => (
              <Select
                placeholder="请选择"
                value={formData.data.type}
                onChange={value => {
                  formData.data.url = '';
                  formData.data.type = value;
                }}
              >
                <Select.Option value="git">git仓库</Select.Option>
                <Select.Option value="npm">npm包</Select.Option>
              </Select>
            )}
          </Form.Item>
          {formData.data.type && (
            <Form.Item
              label={formData.data.type === 'git' ? '仓库地址' : '包名称'}
              required
            >
              <Select
                mode="tags"
                placeholder={`输入${
                  formData.data.type === 'git' ? 'git仓库地址' : 'npm包名称'
                }或选择默认模板`}
                value={formData.data.url ? [formData.data.url] : undefined}
                onChange={value => {
                  formData.data.url =
                    value && value.length ? value[value.length - 1] : '';
                }}
              >
                {() => {
                  if (formData.data.type === 'git') {
                    return (
                      <>
                        <Select.Option value="https://gitee.com/lowcoding/lowcode-materials-template.git">
                          https://gitee.com/lowcoding/lowcode-materials-template.git(国内镜像)
                        </Select.Option>
                        <Select.Option value="https://github.com/lowcoding/lowcode-materials-template.git">
                          https://github.com/lowcoding/lowcode-materials-template.git
                        </Select.Option>
                      </>
                    );
                  } else {
                    return (
                      <Select.Option value="@lowcoding/materials-template">
                        @lowcoding/materials-template
                      </Select.Option>
                    );
                  }
                }}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    );
  },
});
