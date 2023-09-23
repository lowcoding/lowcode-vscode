import * as vscode from 'vscode';
import { IMessage } from '../type';
import { emitter } from '../../utils/emitter';

export const getTask = async (
  message: IMessage,
  context: {
    webview: vscode.Webview;
    task: { task: string; data?: any };
  },
) => context.task;

export const putClipboardImage = async (
  message: IMessage<string>,
  context: {
    webview: vscode.Webview;
    task: { task: string; data?: any };
  },
) => {
  emitter.emit('clipboardImage', message.data);
  return true;
};
