import * as vscode from 'vscode';
import { TextEditor, TextEditorEdit } from 'vscode';
import { getClipboardText, pasteToEditor } from '../utils/editor';
import { compile } from '../utils/ejs';
import { jsonIsValid, jsonParse } from '../utils/json';
import { showWebView } from '../webview';

export const openSnippet = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      'yapi-code.openSnippetByWebview',
      (textEditor: TextEditor, edit: TextEditorEdit, ...args: any[]) => {
        const name = args[0];
        const template = args[1];

        const rawClipboardText = getClipboardText();
        let clipboardText = rawClipboardText.trim();
        clipboardText = JSON.stringify(jsonParse(clipboardText));

        const validJson = jsonIsValid(clipboardText);
        if (validJson) {
          try {
            const code = compile(template, JSON.parse(clipboardText));
            pasteToEditor(code);
          } catch {
            showWebView({
              key: 'main',
              task: {
                task: 'openSnippet',
                data: { name },
              },
            });
          }
        } else {
          showWebView({
            key: 'main',
            task: {
              task: 'openSnippet',
              data: { name },
            },
          });
        }
      },
    ),
  );
};
