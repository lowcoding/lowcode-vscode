import * as vscode from 'vscode';
import { IMessage } from '../type';
import { createChatCompletion } from '../../utils/openai';
import { invokeChatGPTChunkCallback } from '../callback';

export const askChatGPT = async (
  message: IMessage<{ prompt: string }>,
  webview: vscode.Webview,
) => {
  const res = await createChatCompletion({
    apiKey: '',
    model: 'gpt-3.5-turbo',
    text: `interface FormData {
			"成本中心编码"?: string;
			"成本中心名称"?: string;
			"账套编码"?: string;
			"银行核算编码"?: string;
			"订单号"?: string;
			"订单金额"?: string;
			"确收时间"?: string;
			"劳务成本-不含税"?: string;
		} 将中文字段翻译为英文，使用驼峰格式，并将中文作为字段注释`,
    lastMessage: '',
    maxTokens: 2000,
    handleChunk: (data) => {
      invokeChatGPTChunkCallback(webview, message.cbid, data);
    },
  });
  return res;
};
