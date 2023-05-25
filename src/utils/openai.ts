import * as https from 'https';
import { TextDecoder } from 'util';

export const createChatCompletion = (options: {
  apiKey: string;
  model: string;
  text: string;
  context?: string;
  maxTokens: number;
  handleChunk?: (data: { text?: string; hasMore: boolean }) => void;
}) =>
  new Promise<string>((resolve, reject) => {
    let combinedResult = '';
    console.log(1);
    const request = https.request(
      {
        hostname: 'api.chatanywhere.cn',
        port: 443,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${options.apiKey}`,
        },
      },
      (res) => {
        res.on('data', async (chunk) => {
          const text = new TextDecoder('utf-8').decode(chunk);
          console.log(2, text);
          const data = text.split('\n\n').filter((s) => s);
          for (let i = 0; i < data.length; i++) {
            try {
              const element = data[i];
              if (element.includes('data: ')) {
                if (element.includes('[DONE]')) {
                  options.handleChunk &&
                    options.handleChunk({ hasMore: false, text: '' });
                  return;
                }
                // remove 'data: '
                const data = JSON.parse(element.replace('data: ', ''));
                if (data.finish_reason === 'stop') {
                  options.handleChunk &&
                    options.handleChunk({ hasMore: false, text: '' });
                  return;
                }
                const openaiRes = data.choices[0].delta.content;
                if (openaiRes) {
                  // callback({
                  //   type: 'showResponse',
                  //   ok: true,
                  //   text: openaiResp.replaceAll('\\n', '\n'),
                  //   uniqueId,
                  // });
                  options.handleChunk &&
                    options.handleChunk({
                      text: openaiRes.replaceAll('\\n', '\n'),
                      hasMore: true,
                    });
                  combinedResult += openaiRes;
                }
              }
            } catch (e) {
              console.error({
                e,
                element: data[i],
              });
            }
          }
        });
        res.on('error', (e) => {
          console.log(3);
          // if (isStreaming) {
          //   const errorMessage = `OpenAI: API Response was: Error ${e.message} ${URL_ERRORS.OpenAI}`;
          //   vscode.window.showErrorMessage(errorMessage);
          //   callback({
          //     type: 'showResponse',
          //     ok: true,
          //     text: errorMessage,
          //     uniqueId,
          //   });
          //   notStream = errorMessage;
          // }
          // callback({
          //   type: 'isStreaming',
          //   ok: false,
          // });
          reject(e);
        });
        res.on('end', () => {
          console.log(4);
          resolve(combinedResult);
        });
      },
    );
    const body = {
      model: options.model,
      messages: [
        {
          role: 'system',
          content: options.context || '',
        },
        {
          role: 'user',
          content: options.text,
        },
      ],
      stream: true,
      max_tokens: options.maxTokens,
    };
    request.write(JSON.stringify(body));
    request.end();
  });
