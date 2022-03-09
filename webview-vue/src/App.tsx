import { defineComponent } from 'vue';
import { RouterView } from 'vue-router'
import './App.scss';

export default defineComponent({
  name: 'App',
  setup() {
    return () => <RouterView />;
  },
});
