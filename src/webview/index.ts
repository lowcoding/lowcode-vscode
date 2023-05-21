import * as path from 'path';
import * as vscode from 'vscode';
import { window } from 'vscode';
import { getExtensionPath, setLastActiveTextEditorId } from '../context';
import { routes } from './routes';
import { invokeCallback, invokeErrorCallback } from './callback';

type WebViewKeys = 'main' | 'createApp' | 'downloadMaterials' | 'ChatGPT';

type Tasks = 'addSnippets' | 'openSnippet' | 'route' | 'updateSelectedFolder';

let webviewPanels: {
  key: WebViewKeys;
  panel: vscode.WebviewPanel;
  disposables: vscode.Disposable[];
}[] = [];

const getHtmlForWebview = (webview: vscode.Webview) => {
  const mainScriptPathOnDisk = vscode.Uri.file(
    path.join(getExtensionPath(), 'webview-dist', 'main.js'),
  );
  const vendorsScriptPathOnDisk = vscode.Uri.file(
    path.join(getExtensionPath(), 'webview-dist', 'vendors.js'),
  );
  // const scriptUri = 'http://localhost:8000/main.js';
  const mianScriptUri = webview.asWebviewUri(mainScriptPathOnDisk);
  const vendorsScriptUri = webview.asWebviewUri(vendorsScriptPathOnDisk);

  return `
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
				<script src="${vendorsScriptUri}"></script>
				<script src="${mianScriptUri}"></script>
			</body>
		</html>
`;
};

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
    // 创建 webview 的时候，设置之前 focus 的 activeTextEditor
    if (vscode.window.activeTextEditor) {
      setLastActiveTextEditorId((vscode.window.activeTextEditor as any).id);
    }
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
    panel.webview.html = getHtmlForWebview(panel.webview);
    const disposables: vscode.Disposable[] = [];
    panel.webview.onDidReceiveMessage(
      async (message: {
        cmd: string;
        cbid: string;
        data: any;
        skipError?: boolean;
      }) => {
        if (routes[message.cmd]) {
          try {
            const res = await routes[message.cmd](message);
            invokeCallback(panel.webview, message.cbid, res);
          } catch (ex: any) {
            if (!message.skipError) {
              window.showErrorMessage(ex.toString());
            }
            invokeErrorCallback(panel.webview, message.cbid, ex);
          }
        } else {
          invokeErrorCallback(
            panel.webview,
            message.cbid,
            `未找到名为 ${message.cmd} 回调方法!`,
          );
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
      panel,
      disposables,
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

class ChatGPTViewProvider implements vscode.WebviewViewProvider {
  public webview?: vscode.WebviewView['webview'];

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken,
  ): void | Thenable<void> {
    this.webview = webviewView.webview;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(getExtensionPath(), 'webview-dist')),
      ],
    };
    webviewView.webview.html = getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(
      async (message: {
        cmd: string;
        cbid: string;
        data: any;
        skipError?: boolean;
      }) => {
        if (routes[message.cmd]) {
          try {
            const res = await routes[message.cmd](message);
            invokeCallback(webviewView.webview, message.cbid, res);
          } catch (ex: any) {
            if (!message.skipError) {
              vscode.window.showErrorMessage(ex.toString());
            }
            invokeErrorCallback(webviewView.webview, message.cbid, ex);
          }
        } else {
          invokeErrorCallback(
            webviewView.webview,
            message.cbid,
            `未找到名为 ${message.cmd} 回调方法!`,
          );
          vscode.window.showWarningMessage(
            `未找到名为 ${message.cmd} 回调方法!`,
          );
        }
      },
    );

    webviewView.webview.postMessage({
      cmd: 'vscodePushTask',
      task: 'route',
      data: { path: '/config' },
    });
  }
}

let chatGPTViewProvider: ChatGPTViewProvider | undefined;

export const registerChatGPTViewProvider = (
  context: vscode.ExtensionContext,
) => {
  const provider = new ChatGPTViewProvider();
  chatGPTViewProvider = provider;
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('lowcode.chatGPTView', provider, {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    }),
  );
};

export const getChatGPTViewProvider = () => chatGPTViewProvider;
