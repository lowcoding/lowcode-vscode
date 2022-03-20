import * as path from 'path';
import * as fs from 'fs';
import { rootPath } from './vscodeEnv';

export const getFileContent = (filePath: string, fullPath = false) => {
  let fileContent = '';
  const fileFullPath = fullPath ? filePath : path.join(rootPath, filePath);
  try {
    const fileBuffer = fs.readFileSync(fileFullPath);
    fileContent = fileBuffer.toString();
  } catch (error) {}
  return fileContent;
};
