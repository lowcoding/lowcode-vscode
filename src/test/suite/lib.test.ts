import * as path from 'path';
import * as os from 'os';
import { compileScaffold, downloadScaffoldFromGit } from '../../lib';
import { selectDirectory } from '../../utils/editor';

suite('Lib Test Suite', () => {
  test('downloadScaffoldFromGit', async () => {
    try {
      downloadScaffoldFromGit(
        'https://github.com/lowcode-scaffold/lowcode-mock.git',
      );
      await compileScaffold(
        {
          name: '12121',
          emptyREADME: true,
          noREADME: false,
        },
        path.join(os.homedir(), '.lowcode/scaffold.build'),
      );
    } catch (ex) {
      console.log(ex);
    }
  });
  test('selectDirectory', async () => {
    const dir = await selectDirectory();
    console.log(dir);
  });
});
