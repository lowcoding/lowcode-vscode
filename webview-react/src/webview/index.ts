import { notification } from 'antd';
const callbacks: { [propName: string]: (data: any) => void } = {};
if (process.env.NODE_ENV !== 'production') {
  (window as any).vscode = (window as any).vscode
    ? vscode
    : {
        postMessage: (message: { cmd: string; data: any; cbid: string }) => {
          (callbacks[message.cbid] || function() {})(
            require(`./mock/${message.cmd}`).default,
          );
        },
      };
}
export function callVscode(
  data: { cmd: string; data?: any },
  cb?: (data: any) => void,
) {
  if (cb) {
    const cbid = Date.now() + '' + Math.round(Math.random() * 100000);
    callbacks[cbid] = cb;
    vscode.postMessage({
      ...data,
      cbid,
    });
  } else {
    vscode.postMessage(data);
  }
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
        });
      }
      delete callbacks[message.cbid]; // 执行完回调删除
      break;
    default:
      break;
  }
});
