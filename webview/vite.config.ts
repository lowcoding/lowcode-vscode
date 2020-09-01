import { SharedConfig } from 'vite';
import path from 'path';

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

const config: SharedConfig = {
  alias: {
    '/@/': pathResolve('./src'),
  },
};

module.exports = config;
