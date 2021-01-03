import { defineComponent, onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { Layout } from 'ant-design-vue';
import HeaderControl from '../components/HeaderControl';
import './index.scss';

export default defineComponent({
  name: 'Layout',
  setup() {
    const router = useRouter();
    onMounted(() => {
      router.push({
        path: '/snippets',
      });
    });
    return () => (
      <Layout class="base-layout">
        {() => (
          <>
            <div class="control-wrap">
              <HeaderControl />
            </div>
            <Layout.Content style={{ padding: '24px' }}>{() => <RouterView />}</Layout.Content>
          </>
        )}
      </Layout>
    );
  },
});
