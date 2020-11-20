import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import { Layout } from 'ant-design-vue';
import HeaderControl from '../components/HeaderControl';
import './index.scss';

export default defineComponent({
  name: 'Layout',
  setup() {
    return () => (
      <Layout class="base-layout">
        {() => (
          <>
            <div class="control-wrap">
              <HeaderControl />
            </div>
            <Layout.Content>{() => <RouterView />}</Layout.Content>
          </>
        )}
      </Layout>
    );
  },
});
