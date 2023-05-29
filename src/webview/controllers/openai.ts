import * as vscode from 'vscode';
import { IMessage } from '../type';
import { createChatCompletion } from '../../utils/openai';
import { invokeChatGPTChunkCallback } from '../callback';

export const askChatGPT = async (
  message: IMessage<{ prompt: string; context?: string }>,
  context: {
    webview: vscode.Webview;
  },
) => {
  const res = await createChatCompletion({
    apiKey: '',
    model: 'gpt-3.5-turbo',
    text: message.data.prompt,
    context: message.data.context,
    maxTokens: 2000,
    handleChunk: (data) => {
      invokeChatGPTChunkCallback(context.webview, message.cbid, data);
    },
  });
  return res;
};
