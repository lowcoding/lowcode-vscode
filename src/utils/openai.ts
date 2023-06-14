import * as https from 'https';
import { TextDecoder } from 'util';

export const createChatCompletion = (options: {
  apiKey: string;
  model: string;
  maxTokens: number;
  hostname?: string;
  apiPath?: string;
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  handleChunk?: (data: { text?: string; hasMore: boolean }) => void;
}) =>
  new Promise<string>((resolve, reject) => {
    let combinedResult = '';
    let error = '发生错误：';
    const request = https.request(
      {
        hostname: options.hostname || 'api.openai.com',
        port: 443,
        path: options.apiPath || '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${options.apiKey}`,
        },
      },
      (res) => {
        res.on('data', async (chunk) => {
          const text = new TextDecoder('utf-8').decode(chunk);
          const data = text.split('\n\n').filter((s) => s);
          for (let i = 0; i < data.length; i++) {
            try {
              let element = data[i];
              if (element.includes('data: ')) {
                if (element.trim() === 'data:') {
                  // 处理只返回了 data: 的情况
                  return;
                }
              } else if (element.includes('delta')) {
                // 处理没有 data 开头
                element = `data: ${element}`;
              }
              if (element.includes('data: ')) {
                if (element.includes('[DONE]')) {
                  options.handleChunk &&
                    options.handleChunk({ hasMore: true, text: '' });
                  return;
                }
                // remove 'data: '
                const data = JSON.parse(element.replace('data: ', ''));
                if (data.finish_reason === 'stop') {
                  options.handleChunk &&
                    options.handleChunk({ hasMore: true, text: '' });
                  return;
                }
                const openaiRes = data.choices[0].delta.content;
                if (openaiRes) {
                  options.handleChunk &&
                    options.handleChunk({
                      text: openaiRes.replaceAll('\\n', '\n'),
                      hasMore: true,
                    });
                  combinedResult += openaiRes;
                }
              } else {
                options.handleChunk &&
                  options.handleChunk({ hasMore: true, text: element });
                return;
              }
            } catch (e) {
              console.error({
                e,
                element: data[i],
              });
              error = (e as Error).toString();
            }
          }
        });
        res.on('error', (e) => {
          options.handleChunk &&
            options.handleChunk({ hasMore: true, text: e.toString() });
          reject(e);
        });
        res.on('end', () => {
          if (error !== '发生错误：') {
            options.handleChunk &&
              options.handleChunk({ hasMore: true, text: error });
          }
          resolve(combinedResult || error);
        });
      },
    );
    const body = {
      model: options.model,
      messages: options.messages,
      stream: true,
      max_tokens: options.maxTokens,
    };
    request.on('error', (error) => {
      options.handleChunk &&
        options.handleChunk({ hasMore: true, text: error.toString() });
      resolve(error.toString());
    });
    request.write(JSON.stringify(body));
    request.end();
  });
