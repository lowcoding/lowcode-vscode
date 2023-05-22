import { Configuration, OpenAIApi } from 'openai';
import * as https from 'https';
import { TextDecoder } from 'util';

export const createChatCompletion = (options: {
  apiKey: string;
  model: string;
  text: string;
  lastMessage: string;
  maxTokens: number;
  handleChunk?: (data: { text?: string; hasMore: boolean }) => void;
}) =>
  new Promise<string>((resolve, reject) => {
    let combinedResult = '';
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
          const data = text.split('\n\n').filter((s) => s);
          for (let i = 0; i < data.length; i++) {
            try {
              const element = data[i];
              if (element.includes('data: ')) {
                if (element.includes('[DONE]')) {
                  options.handleChunk &&
                    options.handleChunk({ hasMore: false });
                  return;
                }
                // remove 'data: '
                const data = JSON.parse(element.slice(6));
                if (data.finish_reason === 'stop') {
                  options.handleChunk &&
                    options.handleChunk({ hasMore: false });
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
                      hasMore: false,
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
          resolve(combinedResult);
        });
      },
    );
    const body = {
      model: options.model,
      messages: [
        {
          role: 'system',
          content: `You are an AI programming assistent. - Follow the user's requirements carefully & to the letter. -Then ouput the code in a sigle code block - Minimize any other prose.${
            options.lastMessage || ''
          }`,
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

createChatCompletion({
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
}).then((res) => {
  console.log(1212, res);
});
