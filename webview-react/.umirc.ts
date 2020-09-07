import { defineConfig } from 'umi';
import path from 'path';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/layout/index',
      routes: [
        {
          path: '/index',
          component: '@/pages/index',
        },
      ],
    },
  ],
  outputPath: '../webview-dist',
  //mpa: { path: '/', component: '@/pages/index' },
  chunks: ['main'],
  styleLoader: {},
  plugins: [path.join(__dirname, 'plugin')],
});
