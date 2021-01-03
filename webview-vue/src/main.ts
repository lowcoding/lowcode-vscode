import { createApp } from 'vue';
import App from './App';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.css';

createApp(App).use(router).use(store).mount('#root');
