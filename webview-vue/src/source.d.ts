declare const React: string;
declare module '*.json';
declare module '*.png';
declare module '*.jpg';

interface IVscode {
  postMessage(message: any): void;
}
// declare function acquireVsCodeApi(): vscode;
declare let vscode: IVscode;
