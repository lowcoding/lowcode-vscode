import path from 'path';
import fs from 'fs-extra';
import execa from 'execa';
import { renderEjsTemplates } from './ejs';
import { tempDir } from './env';
import { rootPath } from './vscodeEnv';

export const downloadScaffoldFromGit = (remote: string) => {
  fs.removeSync(tempDir.scaffold);
  execa.sync('git', ['clone', ...remote.split(' '), tempDir.scaffold]);
  fs.removeSync(path.join(tempDir.scaffold, '.git'));
  if (
    fs.existsSync(path.join(tempDir.scaffold, 'lowcode.scaffold.config.json'))
  ) {
    return fs.readJSONSync(
      path.join(tempDir.scaffold, 'lowcode.scaffold.config.json'),
    );
  }
  return {};
};

export const copyLocalScaffoldToTemp = (localScaffoldPath?: string) => {
  if (!localScaffoldPath) {
    localScaffoldPath = rootPath;
  }
  if (!localScaffoldPath) {
    throw new Error('当前没有打开项目，请选择本地项目');
  }
  fs.removeSync(tempDir.scaffold);
  fs.copySync(localScaffoldPath, tempDir.scaffold, {
    filter: (src: string, dest: string) => {
      if (src.includes('.git') || src.includes('node_modules')) {
        return false;
      }
      return true;
    },
  });
  fs.removeSync(path.join(tempDir.scaffold, '.git'));
  if (
    fs.existsSync(path.join(tempDir.scaffold, 'lowcode.scaffold.config.json'))
  ) {
    return fs.readJSONSync(
      path.join(tempDir.scaffold, 'lowcode.scaffold.config.json'),
    );
  }
  return {};
};

export const compileScaffold = async (model: any, createDir: string) => {
  if (
    fs.existsSync(path.join(tempDir.scaffold, 'lowcode.scaffold.config.json'))
  ) {
    const config = fs.readJSONSync(
      path.join(tempDir.scaffold, 'lowcode.scaffold.config.json'),
    );
    const excludeCompile: string[] = config.excludeCompile || [];
    if (config.conditionFiles) {
      Object.keys(model).map((key) => {
        if (
          config.conditionFiles[key] &&
          config.conditionFiles[key].value === model[key] &&
          Array.isArray(config.conditionFiles[key].exclude)
        ) {
          config.conditionFiles[key].exclude.map((exclude: string) => {
            fs.removeSync(path.join(tempDir.scaffold, exclude));
          });
        }
      });
    }
    await renderEjsTemplates(model, tempDir.scaffold, excludeCompile);
    fs.removeSync(path.join(tempDir.scaffold, 'lowcode.scaffold.config.json'));
  }
  fs.copySync(tempDir.scaffold, createDir);
};
