import { defineComponent } from 'vue';
import { Radio, Menu, Dropdown } from 'ant-design-vue';

export default defineComponent({
  name: 'HeaderControl',
  setup() {
    const MenuList = (
      <Menu
        onClick={({key}) => {
          console.log(key);
        }}
      >
        {() => (
          <>
            <Menu.Item key="0">{() => '下载物料'}</Menu.Item>
            <Menu.Item key="1">{() => '添加代码片段'}</Menu.Item>
          </>
        )}
      </Menu>
    );
    return () => (
      <div>
        <Radio.Group buttonStyle="solid">
          {() => (
            <>
              <Radio.Button value="/snippets">{() => '代码片段'}</Radio.Button>
              <Radio.Button value="/blocks">{() => '区块'}</Radio.Button>
              <Radio.Button value="/index">{() => '插件配置'}</Radio.Button>
              <Dropdown>
                {{
                  default: () => <Radio.Button value="more">{() => '更多'}</Radio.Button>,
                  overlay: () => MenuList,
                }}
              </Dropdown>
            </>
          )}
        </Radio.Group>
      </div>
    );
  },
});
