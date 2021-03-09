import { compileScaffold, downloadScaffoldFromGit } from '../../lib';

suite('Lib Test Suite', () => {
  test('downloadScaffoldFromGit test', async () => {
    try {
      downloadScaffoldFromGit(
        'https://github.com/lowcode-scaffold/lowcode-mock.git',
      );
      await compileScaffold({ name: '12121' });
    } catch (ex) {
      console.log(ex);
    }
  });
});
