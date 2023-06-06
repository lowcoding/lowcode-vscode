import { useEffect } from 'react';
import { message } from 'antd';
import Service from './service';
import { useModel } from './model';
import { emitter } from '@/utils/emitter';
import { exportChatGPTContent } from '@/webview/service';
import { useChatStore } from './store';

export const usePresenter = () => {
  const model = useModel();
  const chatStore = useChatStore();
  const service = new Service(model, chatStore);

  useEffect(() => {
    emitter.on('chatGPTChunk', (data) => {
      // service.receiveChatGPTChunk(data);
      chatStore.updateMessageByChunck(
        data.sessionId,
        data.messageId,
        data.chunck,
      );
      model.listRef.current?.scrollTo(0, model.listRef.current.scrollHeight);
    });

    emitter.on('askChatGPT', (data) => {
      service.startAsk('NewSessionWithPrompt', data);
    });

    const initPrompt = localStorage.getItem('askChatGPT');
    localStorage.removeItem('askChatGPT');
    if (initPrompt && initPrompt !== model.current.prompt) {
      service.startAsk('NewSessionWithPrompt', initPrompt);
    } else {
      chatStore.newSession();
    }

    return () => {
      emitter.off('chatGPTChunk');
      emitter.off('askChatGPT');
    };
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
      e.preventDefault();
    }
  };

  const handleSubmit = () => {
    if (!model.inputChatPrompt.trim() || model.loading) {
      return;
    }
    service.startAsk('NewMessage', model.inputChatPrompt);
    model.setInputChatPrompt('');
  };

  const handleCopy = (isListItem: boolean, item?: typeof model.chatList[0]) => {
    if (isListItem) {
      navigator.clipboard.writeText(item?.res || '');
    } else {
      navigator.clipboard.writeText(model.current.res || '');
    }
    message.success({
      content: '内容已写入剪切板',
    });
  };

  const handleRetry = (
    isListItem: boolean,
    item?: typeof model.chatList[0],
  ) => {
    if (model.loading) {
    }
    // if (isListItem) {
    //   service.startAsk(item?.prompt || '', '');
    // } else {
    //   service.startAsk(model.current.prompt, '');
    // }
  };

  const handleDel = (isListItem: boolean, item?: typeof model.chatList[0]) => {
    service.delItem(isListItem, item);
  };

  const handleClearContext = () => {
    service.resetCurrent();
    message.success('上下文已清除');
  };

  const handleOpenList = () => {
    message.success('功能开发中...');
  };

  const handleExportContent = () => {
    let content = model.chatList
      .map((s) => `## ${s.prompt}\r\n\r\n${s.res}\r\n\r\n`)
      .join();
    if (model.current.res) {
      content += `## ${model.current.prompt}\r\n\r\n${model.current.res}\r\n\r\n`;
    }
    exportChatGPTContent(content).then(() => {
      message.success('导出成功');
    });
  };

  return {
    model,
    chatStore,
    service,
    handleSubmit,
    handleInputKeyDown,
    handleCopy,
    handleRetry,
    handleDel,
    handleClearContext,
    handleOpenList,
    handleExportContent,
  };
};
