import * as path from 'path';
import * as fs from 'fs-extra';
import { createChatCompletion as openaiCreateChatCompletion } from './openai';
import { emitter } from './emitter';
import { getSyncFolder } from './config';
import { showChatGPTView } from '../webview';

const LLMScript: {
  createChatCompletion?: (options: {
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
    handleChunk?: (data: { text?: string; hasMore: boolean }) => void;
  }) => Promise<string>;
} = {};

const syncFolder = getSyncFolder();

if (syncFolder) {
  const scriptFile = path.join(syncFolder, 'llm/index.js');
  if (fs.existsSync(scriptFile)) {
    delete eval('require').cache[eval('require').resolve(scriptFile)];
    const script = eval('require')(scriptFile);
    if (script.createChatCompletion) {
      LLMScript.createChatCompletion = script.createChatCompletion;
    }
  }
}

export const createChatCompletion = async (options: {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  handleChunk?: (data: { text?: string; hasMore: boolean }) => void;
}) => {
  if (LLMScript.createChatCompletion) {
    const res = await LLMScript.createChatCompletion({
      messages: options.messages,
      handleChunk: (data) => {
        if (options.handleChunk) {
          options.handleChunk(data);
          emitter.emit('chatGPTChunck', data);
        }
      },
    });
    emitter.emit('chatGPTComplete', res);
    return res;
  }
  const res = await openaiCreateChatCompletion({
    messages: options.messages,
    handleChunk: (data) => {
      if (options.handleChunk) {
        options.handleChunk(data);
        emitter.emit('chatGPTChunck', data);
      }
    },
  });
  emitter.emit('chatGPTComplete', res);
  return res;
};

export const createChatCompletionForScript = (options: {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  handleChunk?: (data: { text?: string; hasMore: boolean }) => void;
  showWebview?: boolean;
}) => {
  if (!options.showWebview) {
    return createChatCompletion({
      messages: options.messages,
      handleChunk: options.handleChunk,
    });
  }
  // 打开 webview，使用 emitter 监听结果，把结果回传给 script
  showChatGPTView({
    task: {
      task: 'askChatGPT',
      data: options.messages.map((m) => m.content).join('\n'),
    },
  });
  return new Promise<string>((resolve) => {
    emitter.on('chatGPTChunck', (data) => {
      if (options.handleChunk) {
        options.handleChunk(data);
      }
    });
    emitter.on('chatGPTComplete', (data) => {
      resolve(data);
      emitter.off('chatGPTChunck');
      emitter.off('chatGPTComplete');
    });
  });
};
