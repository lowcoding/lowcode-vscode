/* eslint-disable no-continue */
import * as https from 'https';
import { TextDecoder } from 'util';
import { getChatGPTConfig } from './config';

export const createChatCompletion = (options: {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  handleChunk?: (data: { text?: string }) => void;
}) =>
  new Promise<string>((resolve) => {
    let combinedResult = '';
    let error = '发生错误：';
    const config = getChatGPTConfig();
    const request = https.request(
      {
        hostname: config.hostname || 'api.openai.com',
        port: 443,
        path: config.apiPath || '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
      },
      (res) => {
        let preDataLast = '';
        res.on('data', async (chunk) => {
          const text = new TextDecoder('utf-8').decode(chunk);
          const data = text.split('\n\n').filter((s) => s);
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            try {
              let element = data[i];
              if (i === data.length - 1 && !data[i].endsWith('}')) {
                preDataLast = data[i];
                continue;
              }
              if (element.startsWith('data: ')) {
                if (element.trim() === 'data:') {
                  // 处理只返回了 data: 的情况
                  continue;
                }
              } else {
                // 处理没有 data 开头
                element = preDataLast + element;
              }
              if (element.startsWith('data: ')) {
                if (element.includes('[DONE]')) {
                  if (options.handleChunk) {
                    options.handleChunk({ text: '' });
                  }
                  continue;
                }
                // remove 'data: '
                const data = JSON.parse(element.replace('data: ', ''));
                if (data.finish_reason === 'stop') {
                  if (options.handleChunk) {
                    options.handleChunk({ text: '' });
                  }
                  continue;
                }
                const openaiRes = data.choices[0].delta.content;
                if (openaiRes) {
                  if (options.handleChunk) {
                    options.handleChunk({
                      text: openaiRes.replaceAll('\\n', '\n'),
                    });
                  }
                  combinedResult += openaiRes;
                }
              } else {
                console.log('no includes data: ', element);
                if (options.handleChunk) {
                  options.handleChunk({
                    text: element,
                  });
                }
              }
            } catch (e) {
              console.error({
                e: (e as Error).toString(),
                element: data[i],
              });
              error = (e as Error).toString();
            }
          }
        });
        res.on('error', (e) => {
          if (options.handleChunk) {
            options.handleChunk({
              text: e.toString(),
            });
          }
          resolve(e.toString());
        });
        res.on('end', () => {
          if (error !== '发生错误：') {
            if (options.handleChunk) {
              options.handleChunk({
                text: error,
              });
            }
          }
          resolve(combinedResult || error);
        });
      },
    );
    const body = {
      model: config.model,
      messages: options.messages,
      stream: true,
      max_tokens: config.maxTokens,
    };
    request.on('error', (error) => {
      options.handleChunk && options.handleChunk({ text: error.toString() });
      resolve(error.toString());
    });
    request.write(JSON.stringify(body));
    request.end();
  });
