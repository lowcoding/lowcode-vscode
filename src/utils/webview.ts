import * as path from 'path';
import * as vscode from 'vscode';
import { getExtensionPath } from '../context';
import messageHandler from '../webviewMessageHandler';

type WebViewKeys = 'Main' | '';

type Tasks = 'addSnippets' | 'openSnippet' | 'route';

let webviewPanels: {
  key: WebViewKeys;
  panel: vscode.WebviewPanel;
  disposables: vscode.Disposable[];
}[] = [];

export const showWebView = (options: {
  key: WebViewKeys;
  title?: string;
  viewColumn?: vscode.ViewColumn;
  task?: { task: Tasks; data?: any }; // webview 打开后执行命令，比如转到指定路由
}) => {
  const webview = webviewPanels.find((s) => s.key === options.key);
  if (webview) {
    webview.panel.reveal();
    if (options.task) {
      webview.panel.webview.postMessage({
        cmd: 'vscodePushTask',
        task: options.task.task,
        data: options.task.data,
      });
    }
  } else {
    const panel = vscode.window.createWebviewPanel(
      'lowcode',
      options.title || 'LOW-CODE可视化',
      {
        viewColumn: options.viewColumn || vscode.ViewColumn.Two,
        preserveFocus: true,
      },
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(getExtensionPath(), 'webview-dist')),
        ],
        retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
      },
    );
    setWebviewHtml(panel);
    const disposables: vscode.Disposable[] = [];
    panel.webview.onDidReceiveMessage(
      (message: { cmd: string; cbid: string; data: any }) => {
        if (messageHandler[message.cmd]) {
          messageHandler[message.cmd](panel, message);
        } else {
          vscode.window.showWarningMessage(
            `未找到名为 ${message.cmd} 回调方法!`,
          );
        }
      },
      null,
      disposables,
    );
    panel.onDidDispose(
      () => {
        panel.dispose();
        while (disposables.length) {
          const x = disposables.pop();
          if (x) {
            x.dispose();
          }
        }
        webviewPanels = webviewPanels.filter((s) => s.key !== options.key);
      },
      null,
      disposables,
    );
    webviewPanels.push({
      key: options.key,
      panel: panel,
      disposables: disposables,
    });
    if (options.task) {
      panel.webview.postMessage({
        cmd: 'vscodePushTask',
        task: options.task.task,
        data: options.task.data,
      });
    }
  }
};

const setWebviewHtml = (panel: vscode.WebviewPanel) => {
  const scriptPathOnDisk = vscode.Uri.file(
    path.join(getExtensionPath(), 'webview-dist', 'main.js'),
  );
  const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);

  panel.webview.html = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8" />
				<meta
				name="viewport"
				content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
				/>
				<script>
				    window.routerBase = "/";
				</script>
				<script>
                   window.g_path = "/";
				</script>
				<script>
				   window.vscode = acquireVsCodeApi();
                </script>
			</head>
			<body>
				<div id="root"></div>
				<script src="${scriptUri}"></script>
			</body>
		</html>
`;
};
