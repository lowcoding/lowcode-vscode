import { computed, defineComponent, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { Form, Button, Menu, Dropdown, message } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';
import CodeMirror from '../../../components/CodeMirror';
import { genCodeByBlockMaterial, getLocalMaterials } from '../../../vscode/service';
import router from '../../../router';
import JsonToTs from '../../../components/JsonToTs';
import YapiModal from '../../../components/YapiModal';
import SelectDirectory from '../../../components/SelectDirectory';

export default defineComponent({
  setup() {
    const route = useRoute();
    const selectedMaterial = reactive<{
      data: {
        path: string;
        name: string;
        model: object;
        schema: object;
        preview: {
          title?: string;
          description?: string;
          img?: string;
        };
      };
    }>({ data: { schema: {}, model: {} } } as any);
    const dialogVisible = reactive<{ jsonToTs: boolean; yapi: boolean; directory: boolean }>({
      jsonToTs: false,
      yapi: false,
      directory: false,
    });
    const modelJson = computed(() => JSON.stringify(selectedMaterial.data.model, null, 2));
    onMounted(() => {
      const name = route.params['name'];
      getLocalMaterials('blocks').then((res) => {
        if (res.length) {
          const selected = res.find((s) => s.name === name);
          if (selected) {
            selectedMaterial.data = selected;
          }
        }
      });
    });
    const menu = (
      <Menu
        onClick={({ key }) => {
          if (key === 'jsonToJs') {
            dialogVisible.jsonToTs = true;
          }
          if (key === 'yapi') {
            dialogVisible.yapi = true;
          }
        }}
      >
        {() => (
          <>
            <Menu.Item key="jsonToJs">{() => 'JSON TO TS'}</Menu.Item>
            <Menu.Item key="yapi">{() => '根据 YAPI 接口追加模板数据'}</Menu.Item>
          </>
        )}
      </Menu>
    );
    return () => (
      <div>
        <Form layout="vertical">
          {() => (
            <>
              <Form.Item label="模板数据">
                {() => (
                  <CodeMirror
                    domId="model"
                    lint
                    value={JSON.stringify(selectedMaterial.data.model, null, 2)}
                    onChange={(value) => {
                      selectedMaterial.data.model = JSON.parse(value);
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item>
                {() => (
                  <>
                    <Dropdown overlay={menu}>
                      {() => (
                        <a onClick={(e) => e.preventDefault()}>
                          更多功能 <DownOutlined />
                        </a>
                      )}
                    </Dropdown>
                    &nbsp;&nbsp;
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        dialogVisible.directory = true;
                      }}
                    >
                      {() => '生成代码'}
                    </Button>
                  </>
                )}
              </Form.Item>
            </>
          )}
        </Form>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Button
            shape="round"
            onClick={() => {
              router.push('/blocks');
            }}
            style={{ width: '50%' }}
          >
            {() => '返回'}
          </Button>
        </div>
        <JsonToTs
          visible={dialogVisible.jsonToTs}
          json={modelJson.value}
          onOk={(typeCode) => {
            selectedMaterial.data.model = {
              ...selectedMaterial.data.model,
              type: typeCode,
            };
            dialogVisible.jsonToTs = false;
          }}
          onCancel={() => {
            dialogVisible.jsonToTs = false;
          }}
        />
        <YapiModal
          visible={dialogVisible.yapi}
          onOk={(model) => {
            dialogVisible.yapi = false;
            selectedMaterial.data.model = { ...selectedMaterial.data.model, ...(model as object) };
          }}
          onCancel={() => {
            dialogVisible.yapi = false;
          }}
        />
        <SelectDirectory
          visible={dialogVisible.directory}
          onCancel={() => {
            dialogVisible.directory = false;
          }}
          onOk={(path, creatPath) => {
            genCodeByBlockMaterial({
              material: selectedMaterial.data.name,
              model: selectedMaterial.data.model,
              path: path,
              createPath: creatPath,
            }).then(() => {
              message.success('生成成功');
              dialogVisible.directory = false;
            });
          }}
        />
      </div>
    );
  },
});
