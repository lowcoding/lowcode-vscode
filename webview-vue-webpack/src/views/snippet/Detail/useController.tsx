import { getLocalMaterials } from '@/vscode/service';
import { onMounted } from 'vue';
import { Form, Button, Menu, Dropdown, message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import useService from './useService';

const useController = () => {
  const route = useRoute();

  const service = useService();
  const { model } = service;

  onMounted(() => {
    const name = route.params['name'];
    getLocalMaterials('snippets').then(res => {
      if (res.length) {
        const selected = res.find(s => s.name === name);
        if (selected) {
          model.selectedMaterial.data = selected;
        }
      }
    });
  });
  const menu = (
    <Menu
      onClick={({ key }) => {
        if (key === 'jsonToJs') {
          model.dialogVisible.jsonToTs = true;
        }
        if (key === 'yapi') {
          model.dialogVisible.yapi = true;
        }
      }}
    >
      <Menu.Item key="jsonToJs">{() => 'JSON TO TS'}</Menu.Item>
      <Menu.Item key="yapi">{() => '根据 YAPI 接口追加模板数据'}</Menu.Item>
    </Menu>
  );

  return {
    service,
    menu,
  };
};

export default useController;
