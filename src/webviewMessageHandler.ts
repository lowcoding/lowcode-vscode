import { WebviewPanel, window } from 'vscode';

interface IMessage {
  cmd: string;
  cbid: string;
  data: any;
}

function invokeCallback(panel: WebviewPanel, cbid: string, res: any) {
  panel.webview.postMessage({
    cmd: 'vscodeCallback',
    cbid: cbid,
    data: res,
  });
}

const messageHandler: {
  [propName: string]: (pandel: WebviewPanel, message: IMessage) => void;
} = {
  alert(pandel: WebviewPanel, message: IMessage) {
    window.showErrorMessage(message.data);
    invokeCallback(pandel, message.cbid, '来自vscode的回复');
  },
};

export default messageHandler;
