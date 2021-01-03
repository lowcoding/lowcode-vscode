import * as vscode from 'vscode';
import { getSnippets } from '../config';
import { compile as compileEjs } from '../compiler/ejs';

let provider: vscode.Disposable;

export const registerCompletion = (context: vscode.ExtensionContext) => {
  if (provider) {
    provider.dispose();
  }
  // provideCompletionItems 每一次输入都会运行一次，将 getSnippets 移到外部，通过手动刷新
  const snippets = getSnippets();
  provider = vscode.languages.registerCompletionItemProvider(
    { pattern: '**', scheme: 'file' },
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext,
      ) {
        const completionItems: vscode.CompletionItem[] = [];
        snippets.map((s) => {
          const completionItem = new vscode.CompletionItem(
            s.name.replace('.ejs', ''),
          );
          completionItem.kind = vscode.CompletionItemKind.Class;
          completionItem.documentation = s.template || 'lowcode';
          try {
            const code = compileEjs(s.template, {} as any);
            // 支持 vscode 本身 Snippet 语法
            completionItem.insertText = new vscode.SnippetString(code);
          } catch {
            // 无法直接通过 ejs 编译，说明模板中需要额外的数据，触发命令打开 webview
            completionItem.insertText = '';
            completionItem.command = {
              command: 'yapi-code.openSnippetByWebview',
              title: '',
              arguments: [s.name, s.template],
            };
          }
          completionItems.push(completionItem);
        });
        return completionItems;
      },
    },
  );
  context.subscriptions.push(provider);
};
