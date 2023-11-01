import { closeWebView, showWebView } from '../webview';
import { emitter } from './emitter';

export const getClipboardImage = () =>
  new Promise<string>((resolve) => {
    showWebView({
      key: 'getClipboardImage',
      task: { task: 'getClipboardImage' },
    });
    emitter.on('clipboardImage', (data) => {
      emitter.off('clipboardImage');
      setTimeout(() => {
        closeWebView('getClipboardImage');
      }, 300);
      resolve(data);
    });
  });
