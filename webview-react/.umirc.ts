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
      path: '/downloadMaterials',
      component: '@/pages/downloadMaterials',
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
  chunks: ['vendors', 'main'],
	chainWebpack: function(config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
					cacheGroups: {
						vendors: {
							name: 'vendors',
							test: /[\\/]node_modules[\\/]/,
							chunks: 'all'
						}
					}
        },
      },
    });
  },
  styleLoader: {},
  plugins: [path.join(__dirname, 'plugin')],
  antd: {
    dark: false,
  },
  cssLoader: {
    localsConvention: 'camelCase',
  },
});
