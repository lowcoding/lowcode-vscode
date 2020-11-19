import { createApp } from 'vue';
import App from './App';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.css';
import '/@/style/index.scss';

createApp(App).use(router).use(store).mount('#root');
