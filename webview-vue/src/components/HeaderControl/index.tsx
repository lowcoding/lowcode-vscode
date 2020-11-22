import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { Radio, Menu, Dropdown } from 'ant-design-vue';
import useHeaderControlTab, { Tab, TabOptions } from '../../model/headerControlTab';

export default defineComponent({
  name: 'HeaderControl',
  setup() {
    const { tab, updateTab } = useHeaderControlTab();
    const router = useRouter();
    const MenuList = (
      <Menu
        onClick={({ key }) => {
          if (key === '1') {
          }
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
        <Radio.Group
          buttonStyle="solid"
          value={tab}
          onChange={(e) => {
            const value = e.target.value as Tab;
            if (value !== 'more') {
              updateTab(value);
              router.push({
                path: value,
              });
            }
          }}
        >
          {() => (
            <>
              <Radio.Button value={TabOptions[0]}>{() => '代码片段'}</Radio.Button>
              <Radio.Button value={TabOptions[1]}>{() => '区块'}</Radio.Button>
              <Radio.Button value={TabOptions[2]}>{() => '插件配置'}</Radio.Button>
              <Dropdown>
                {{
                  default: () => <Radio.Button value={TabOptions[3]}>{() => '更多'}</Radio.Button>,
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
