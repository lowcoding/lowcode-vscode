import * as path from 'path';
import * as fs from 'fs-extra';
import {
  Config,
  getConfig,
  getSyncFolder,
  saveSyncFolder,
  saveConfig,
} from '../../utils/config';
import { IMessage } from '../type';
import { rootPath } from '../../utils/vscodeEnv';

export const getPluginConfig = () => getConfig();

export const savePluginConfig = (message: IMessage<Config>) => {
  // 处理旧的配置
  const packageObj = fs.readJsonSync(path.join(rootPath, 'package.json'));
  if (
    packageObj['yapi-code.domain'] ||
    packageObj['yapi-code.project'] ||
    packageObj['yapi-code.mockNumber'] ||
    packageObj['yapi-code.mockString'] ||
    packageObj['yapi-code.mockBoolean'] ||
    packageObj['yapi-code.mockKeyWordEqual'] ||
    packageObj['yapi-code.mockKeyWordLike']
  ) {
    delete packageObj['yapi-code.domain'];
    delete packageObj['yapi-code.project'];
    delete packageObj['yapi-code.mockNumber'];
    delete packageObj['yapi-code.mockString'];
    delete packageObj['yapi-code.mockBoolean'];
    delete packageObj['yapi-code.mockKeyWordEqual'];
    delete packageObj['yapi-code.mockKeyWordLike'];
    fs.writeFileSync(
      path.join(rootPath, 'package.json'),
      JSON.stringify(packageObj, null, 2),
    );
  }

  saveConfig(message.data);
  return '保存成功';
};

export const getSyncFolderConfig = () => getSyncFolder();

export const saveSyncFolderConfig = (message: IMessage<string>) => {
  saveSyncFolder(message.data);
  return true;
};
