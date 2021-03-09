import * as assert from 'assert';
import * as vscode from 'vscode';
import { getSnippets } from '../../config';
import { downloadScaffoldFromGit } from '../../lib';
// import * as myExtension from '../../extension';
suite('Lib Test Suite', () => {
  test('downloadScaffoldFromGit test', () => {
    console.log(121212);
    try {
      console.log(5555);
      downloadScaffoldFromGit(
        'https://git.vankeservice.com/v0417672/setsuna-low-code-mock.git',
      );
    } catch (ex) {
      console.log(ex);
    }
  });
});
