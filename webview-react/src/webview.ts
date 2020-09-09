const callbacks: { [propName: string]: (data: any) => void } = {};

export function callVscode(
  data: { cmd: string; data: any },
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
      (callbacks[message.cbid] || function() {})(message.data);
      delete callbacks[message.cbid]; // 执行完回调删除
      break;
    default:
      break;
  }
});
