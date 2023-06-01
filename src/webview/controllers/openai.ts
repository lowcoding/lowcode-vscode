import * as vscode from 'vscode';
import { IMessage } from '../type';
import { createChatCompletion } from '../../utils/openai';
import { invokeChatGPTChunkCallback } from '../callback';
import { pasteToEditor } from '../../utils/editor';
import { getChatGPTConfig } from '../../utils/config';

export const askChatGPT = async (
  message: IMessage<{ prompt: string; context?: string }>,
  context: {
    webview: vscode.Webview;
  },
) => {
  const config = getChatGPTConfig();
  const res = await createChatCompletion({
    hostname: config.hostname,
    apiPath: config.apiPath,
    apiKey: config.apiKey,
    model: config.model,
    text: message.data.prompt,
    context: message.data.context,
    maxTokens: config.maxTokens,
    handleChunk: (data) => {
      invokeChatGPTChunkCallback(context.webview, message.cbid, data);
    },
  });
  return res;
};

export const insertCode = async (message: IMessage<string>) => {
  await pasteToEditor(message.data);
  return true;
};

export const exportChatGPTContent = async (message: IMessage<string>) => {
  const document = await vscode.workspace.openTextDocument({
    language: 'markdown',
  });
  const edit = new vscode.TextEdit(new vscode.Range(0, 0, 0, 0), message.data);
  const workspaceEdit = new vscode.WorkspaceEdit();
  workspaceEdit.set(document.uri, [edit]);
  await vscode.workspace.applyEdit(workspaceEdit);
  await vscode.window.showTextDocument(document);
  return true;
};
