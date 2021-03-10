import { defineConfig } from 'umi';
import path from 'path';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/scaffold',
      component: '@/pages/scaffold/List',
    },
    {
      path: '/',
      component: '@/layout/index',
      routes: [
        {
          path: '/config',
          component: '@/pages/config',
        },
        {
          path: '/blocks',
          component: '@/pages/blocks/List',
        },
        {
          path: '/blocks/detail/:name',
          component: '@/pages/blocks/Detail',
        },
        {
          path: '/snippets',
          component: '@/pages/snippets/List',
        },
        {
          path: '/snippets/add/:time',
          component: '@/pages/snippets/AddSnippet',
        },
        {
          path: '/snippets/detail/:name',
          component: '@/pages/snippets/Detail',
        },
      ],
    },
  ],
  outputPath: '../webview-dist',
  //mpa: { path: '/', component: '@/pages/index' },
  chunks: ['main'],
  styleLoader: {},
  plugins: [path.join(__dirname, 'plugin')],
  antd: {
    dark: false,
  },
});
