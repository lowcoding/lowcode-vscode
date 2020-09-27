import * as path from 'path';
import * as fs from 'fs-extra';
import { renderEjsTemplates } from '../src/compiler/ejs';

const materialsPath = path.join(process.cwd(), 'materials/blocks', '列表页');
const tempWordDir = path.join(process.cwd(), '.lowcode');
fs.copySync(materialsPath, tempWordDir);
renderEjsTemplates({ name: 1212, title: 'hjhjhj' }, tempWordDir).then(() => {
  fs.copySync(
    path.join(tempWordDir, 'src'),
    path.join(process.cwd(), 'test/pages/module'),
  );
  fs.removeSync(tempWordDir);
});
