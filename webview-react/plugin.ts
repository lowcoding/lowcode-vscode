import path from 'path';
import { IApi } from 'umi';

export default function renamePlugin(api: IApi) {
  return api.chainWebpack(config => {
    config.entry('main').add(path.join(api.paths.absTmpPath!, 'umi.ts'));
    // 移除旧的
    config.entryPoints.delete('umi');
    return config;
  });
}
