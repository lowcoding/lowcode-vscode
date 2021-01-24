import { notification } from 'antd';
import { history } from 'umi';
const callbacks: { [propName: string]: (data: any) => void } = {};
const errorCallbacks: { [propName: string]: (data: any) => void } = {};
if (process.env.NODE_ENV !== 'production') {
  (window as any).vscode = (window as any).vscode
    ? vscode
    : {
        postMessage: (message: { cmd: string; data: any; cbid: string }) => {
          notification.success({
            message: 'call vscode',
            description: `cmd: ${message.cmd}`,
          });
          (callbacks[message.cbid] || function() {})(
            require(`./mock/${message.cmd}`).default,
          );
        },
      };
}
export function callVscode(
  data: { cmd: string; data?: any },
  cb?: (data: any) => void,
  errorCb?: (data: any) => void,
) {
  if (cb) {
    const cbid = Date.now() + '' + Math.round(Math.random() * 100000);
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

export function callVscodePromise(cmd: string, data: any) {
  return new Promise((resolve, reject) => {
    callVscode(
      { cmd: cmd, data: data },
      res => {
        resolve(res);
      },
      error => {
        reject(error);
      },
    );
  });
}

export function request<T = unknown>(params: { cmd: string; data?: any }) {
  return new Promise<T>((resolve, reject) => {
    callVscode(
      { cmd: params.cmd, data: params.data },
      res => {
        resolve(res);
      },
      error => {
        reject(error);
      },
    );
  });
}

window.addEventListener('message', event => {
  const message = event.data;
  switch (message.cmd) {
    // 来自vscode的回调
    case 'vscodeCallback':
      if (message.code === 200) {
        (callbacks[message.cbid] || function() {})(message.data);
      } else {
        notification.error({
          message: message.data.title,
          description: message.data.message,
          placement: 'bottomRight',
        });
        (errorCallbacks[message.cbid] || function() {})(message.data);
      }
      delete callbacks[message.cbid]; // 执行完回调删除
      delete errorCallbacks[message.cbid]; // 执行完回调删除
      break;
    // vscode推送任务
    case 'vscodePushTask': {
      if (message.task === 'addSnippets') {
        // notification.info({
        //   message: '',
        //   description: JSON.stringify(message.data),
        // });
        localStorage.setItem('addSnippets', message.data.content || '');
        history.push(`/snippets/add/${new Date().getTime()}`);
      }
      if (message.task === 'openSnippet') {
        history.push(`/snippets/detail/${message.data.name}`);
      }
    }
    default:
      break;
  }
});
