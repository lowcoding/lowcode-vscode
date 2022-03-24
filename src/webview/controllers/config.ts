import * as path from 'path';
import * as fs from 'fs-extra';
import { getAllConfig, saveAllConfig } from '../../config';
import { IMessage } from '../type';
import { rootPath } from '../../utils/vscodeEnv';

export const getPluginConfig = () => getAllConfig();

export const savePluginConfig = (
  message: IMessage<{
    yapi: {
      domain: string;
      projects: {
        name: string;
        token: string;
        domain: string;
      }[];
    };
    mock: {
      mockNumber: string;
      mockBoolean: string;
      mockString: string;
      mockKeyWordEqual: {
        key: string;
        value: string;
      }[];
      mockKeyWordLike: {
        key: string;
        value: string;
      }[];
    };
    saveOption: ['vscode', 'package'];
  }>,
) => {
  const mockKeyWordEqual = {} as any;
  message.data.mock.mockKeyWordEqual.map((s) => {
    mockKeyWordEqual[s.key] = s.value;
  });
  const mockKeyWordLike = {} as any;
  message.data.mock.mockKeyWordLike.map((s) => {
    mockKeyWordLike[s.key] = s.value;
  });
  if (message.data.saveOption.includes('vscode')) {
    saveAllConfig({
      yapi: { ...message.data.yapi },
      mock: { ...message.data.mock, mockKeyWordEqual, mockKeyWordLike },
    });
  }
  if (message.data.saveOption.includes('package')) {
    const packageObj = fs.readJsonSync(path.join(rootPath, 'package.json'));
    const newPackageObj = {
      ...packageObj,
      'yapi-code.domain': message.data.yapi.domain,
      'yapi-code.project': message.data.yapi.projects,
      'yapi-code.mockNumber': message.data.mock.mockNumber,
      'yapi-code.mockBoolean': message.data.mock.mockBoolean,
      'yapi-code.mockString': message.data.mock.mockString,
      'yapi-code.mockKeyWordEqual': mockKeyWordEqual,
      'yapi-code.mockKeyWordLike': mockKeyWordLike,
    };
    fs.writeFileSync(
      path.join(rootPath, 'package.json'),
      JSON.stringify(newPackageObj, null, 2),
    );
  }
  return '保存成功';
};
