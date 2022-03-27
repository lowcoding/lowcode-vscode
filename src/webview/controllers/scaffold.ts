import { commands, Uri } from 'vscode';
import { selectDirectory as openSelectDirectory } from '../../utils/editor';
import { fetchScaffolds } from '../../utils/request';
import {
  compileScaffold,
  copyLocalScaffoldToTemp,
  downloadScaffoldFromGit,
} from '../../utils/scaffold';
import { IMessage } from '../type';

export const getScaffolds = async (message: IMessage<{ url: string }>) => {
  const res = await fetchScaffolds(message.data.url);
  return res.data || [];
};

export const downloadScaffold = (
  message: IMessage<{
    type: 'git' | 'npm';
    repository: string;
  }>,
) => {
  if (message.data.type === 'git') {
    const config = downloadScaffoldFromGit(message.data.repository);
    return config;
  }
};

export const selectDirectory = async () => {
  const dirs = await openSelectDirectory();
  return dirs;
};

export const createProject = async (
  message: IMessage<{
    model: any;
    createDir: string;
    immediateOpen: boolean;
  }>,
) => {
  await compileScaffold(message.data.model, message.data.createDir);
  if (message.data.immediateOpen) {
    commands.executeCommand(
      'vscode.openFolder',
      Uri.file(message.data.createDir),
      true,
    );
  }
  return '创建项目成功';
};

export const useLocalScaffold = (
  message: IMessage<{
    localPath?: string;
  }>,
) => {
  const config = copyLocalScaffoldToTemp(message.data.localPath);
  return config;
};
