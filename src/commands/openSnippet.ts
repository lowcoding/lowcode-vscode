import * as vscode from 'vscode';
import { TextEditor, TextEditorEdit } from 'vscode';
import { compile } from '../compiler/ejs';
import {
  getClipboardText,
  jsonIsValid,
  jsonParse,
  pasteToMarker,
} from '../lib';
import { WebView } from './createOrShowWebview';
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
            pasteToMarker(code);
          } catch {
            WebView.createOrShow(context.extensionPath);
            WebView.pushTask({
              task: 'openSnippet',
              data: { name: name },
            });
          }
        } else {
          WebView.createOrShow(context.extensionPath);
          WebView.pushTask({
            task: 'openSnippet',
            data: { name: name },
          });
        }
      },
    ),
  );
};
