import * as vscode from 'vscode';
import { IMessage } from '../type';

export const getTask = async (
  message: IMessage,
  context: {
    webview: vscode.Webview;
    task: { task: string; data?: any };
  },
) => context.task;
