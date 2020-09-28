import { WebviewPanel, window, workspace } from 'vscode';
import * as dirTree from 'directory-tree';

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
  getDirectoryTree(pandel: WebviewPanel, message: IMessage) {
    const filteredTree = dirTree(workspace.rootPath!, {
      exclude: /node_modules|\.umi/,
    });
    invokeCallback(pandel, message.cbid, filteredTree);
  },
};

export default messageHandler;
