import * as path from 'path';
import * as vscode from 'vscode';
import { getSelectedText, setLastActiveTextEditorId } from '../lib';
import messageHandler from '../webviewMessageHandler';

export const createOrShowWebview = (context: vscode.ExtensionContext) => {
  return vscode.commands.registerTextEditorCommand(
    'yapi-code.generateCodeByWebview',
    () => {
      ReactPanel.createOrShow(context.extensionPath);
    },
  );
};

/**
 * Manages react webview panels
 */
class ReactPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: ReactPanel | undefined;

  private static readonly viewType = 'react';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionPath: string) {
    // If we already have a panel, show it.
    // Otherwise, create a new panel.
    if (ReactPanel.currentPanel) {
      ReactPanel.currentPanel._panel.reveal();
    } else {
      // 创建 webview 的时候，设置之前 focus 的 activeTextEditor
      if (vscode.window.activeTextEditor) {
        setLastActiveTextEditorId((vscode.window.activeTextEditor as any).id);
      }
      ReactPanel.currentPanel = new ReactPanel(
        extensionPath,
        vscode.ViewColumn.Two,
      );
    }
  }

  private constructor(extensionPath: string, column: vscode.ViewColumn) {
    this._extensionPath = extensionPath;

    // Create and show a new webview panel
    this._panel = vscode.window.createWebviewPanel(
      ReactPanel.viewType,
      'LOW-CODE可视化',
      { viewColumn: column, preserveFocus: true },
      {
        // Enable javascript in the webview
        enableScripts: true,
        // And restric the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.file(path.join(this._extensionPath, 'webview-dist')),
        ],
        retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
      },
    );

    // Set the webview's initial html content
    this._panel.webview.html = this._getHtmlForWebview();

    this._panel.webview.onDidReceiveMessage(
      (message: { cmd: string; cbid: string; data: any }) => {
        if (messageHandler[message.cmd]) {
          messageHandler[message.cmd](this._panel, message);
        } else {
          vscode.window.showWarningMessage(
            `未找到名为 ${message.cmd} 回调方法!`,
          );
        }
      },
      null,
      this._disposables,
    );

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public doRefactor() {
    // Send a message to the webview webview.
    // You can send any JSON serializable data.
    this._panel.webview.postMessage({ command: 'refactor' });
  }

  public dispose() {
    ReactPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview() {
    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, 'webview-dist', 'main.js'),
    );
    const scriptUri = this._panel.webview.asWebviewUri(scriptPathOnDisk);
    // const stylePathOnDisk = vscode.Uri.file(
    //   path.join(this._extensionPath, 'webview-dist', 'main.css'),
    // );
    // const styleUri = this._panel.webview.asWebviewUri(stylePathOnDisk);

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

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
				<script src="${scriptUri}"></script>
			</body>
		</html>
`;
  }
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
