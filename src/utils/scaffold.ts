import * as path from 'path';
import * as fs from 'fs-extra';
import * as execa from 'execa';
import { renderEjsTemplates } from './ejs';
import { tempDir } from './env';

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
