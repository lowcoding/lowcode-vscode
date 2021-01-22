import { defineComponent, ref } from 'vue';
import { Layout, Breadcrumb } from 'ant-design-vue';

export default defineComponent({
  name: 'App',
  props: {
    msg: {
      type: String,
      default: '',
    },
  },
  setup(prop) {
    const count = ref(0);
    return () => (
      <Layout>
        <Layout.Header></Layout.Header>
        <Layout.Content>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <h1>{prop.msg}</h1>
          <button
            onClick={() => {
              count.value++;
            }}
          >
            count is: {count.value}
          </button>
          <p>
            Edit <code>components/HelloWorld.vue</code> to test hot module replacement.
          </p>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Layout.Footer>
      </Layout>
    );
  },
});
