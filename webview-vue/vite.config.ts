import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';

const pathResolve = (pathStr: string) => {
  console.log(path.resolve(__dirname, '.', pathStr));
  return path.resolve(__dirname, '.', pathStr);
};
const config: UserConfig = {
  //   alias: {
  //     '@': pathResolve('src'),
  //   },
  plugins: [vue(), vueJsx()],
  optimizeDeps: {
	exclude:['tinycolor2']
  },
  build: {
    outDir: '../webview-dist',
    assetsDir: '',
    assetsInlineLimit: 40000,
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        assetFileNames: (info) => {
          return 'main.css';
        },
      },
    },
	cssCodeSplit: true,
  },
  logLevel:"silent"
};

module.exports = config;
