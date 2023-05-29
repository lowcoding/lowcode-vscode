import { notification, message as antdMessage } from 'antd';
import { taskHandler } from './handleTask';

const callbacks: { [propName: string]: (data: any) => void } = {};
const errorCallbacks: { [propName: string]: (data: any) => void } = {};
if (process.env.NODE_ENV !== 'production') {
  (window as any).vscode = (window as any).vscode
    ? vscode
    : {
        postMessage: (message: { cmd: string; data: any; cbid: string }) => {
          setTimeout(() => {
            notification.success({
              message: 'call vscode',
              description: `cmd: ${message.cmd}`,
            });
            (callbacks[message.cbid] || function () {})(
              require(`./mock/${message.cmd}`).default,
            );
          }, 1000);
        },
      };
}
export function callVscode(
  data: { cmd: string; data?: any; skipError?: boolean },
  cb?: (data: any) => void,
  errorCb?: (data: any) => void,
) {
  if (cb) {
    const cbid = `${Date.now()}${Math.round(Math.random() * 100000)}`;
    callbacks[cbid] = cb;
    vscode.postMessage({
      ...data,
      cbid,
    });
    if (errorCb) {
      errorCallbacks[cbid] = errorCb;
    }
  } else {
    vscode.postMessage(data);
  }
}

export function callVscodePromise(cmd: string, data: any, skipError?: boolean) {
  return new Promise((resolve, reject) => {
    callVscode(
      { cmd, data, skipError },
      (res) => {
        resolve(res);
      },
      (error) => {
        reject(error);
      },
    );
  });
}

export function request<T = unknown>(params: {
  cmd: string;
  data?: any;
  skipError?: boolean;
}) {
  return new Promise<T>((resolve, reject) => {
    callVscode(
      { cmd: params.cmd, data: params.data, skipError: params.skipError },
      (res) => {
        resolve(res);
      },
      (error) => {
        reject(error);
      },
    );
  });
}

window.addEventListener('message', (event) => {
  const message = event.data;
  switch (message.cmd) {
    // 来自vscode的回调
    case 'vscodeCallback':
      if (message.code === 200) {
        (callbacks[message.cbid] || function () {})(message.data);
      } else {
        (errorCallbacks[message.cbid] || function () {})(message.data);
      }
      delete callbacks[message.cbid];
      delete errorCallbacks[message.cbid];
      break;
    // 来自 chatgpt chunck 的回调
    case 'vscodeChatGPTChunkCallback':
      if (taskHandler[message.task]) {
        taskHandler[message.task](message.data);
      } else {
        antdMessage.error(`未找到名为 ${message.task} 回调方法!`);
      }
      break;
    // vscode 主动推送task
    case 'vscodePushTask': {
      if (taskHandler[message.task]) {
        taskHandler[message.task](message.data);
      } else {
        antdMessage.error(`未找到名为 ${message.task} 回调方法!`);
      }
    }
    default:
      break;
  }
});
