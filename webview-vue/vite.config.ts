import { UserConfig } from 'vite';
import path from 'path';

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

const config: UserConfig = {
  alias: {
    '/@/': pathResolve('./src'),
  },
  outDir: '../webview-dist',
  assetsDir: '',
  assetsInlineLimit: 40000,
  rollupOutputOptions: {
    entryFileNames: 'main.js',
    assetFileNames: (info) => {
      return 'main.css';
    },
  },
  cssCodeSplit: true,
};

module.exports = config;
