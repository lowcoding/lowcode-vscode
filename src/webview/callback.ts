import * as vscode from 'vscode';

export function invokeCallback<T = any>(
  webview: vscode.Webview,
  cbid: string,
  res: T,
) {
  webview.postMessage({
    cmd: 'vscodeCallback',
    cbid,
    data: res,
    code: 200,
  });
}

export function invokeChatGPTChunkCallback<T = any>(
  webview: vscode.Webview,
  cbid: string,
  res: T,
) {
  webview.postMessage({
    cmd: 'vscodeChatGPTChunkCallback',
    task: 'handleChatGPTChunk',
    cbid,
    data: res,
    code: 200,
  });
}

export function invokeErrorCallback(
  webview: vscode.Webview,
  cbid: string,
  res: any,
) {
  webview.postMessage({
    cmd: 'vscodeCallback',
    cbid,
    data: res,
    code: 400,
  });
}
