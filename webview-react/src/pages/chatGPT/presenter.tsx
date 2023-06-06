import { useEffect } from 'react';
import { message } from 'antd';
import Service from './service';
import { useModel } from './model';
import { emitter } from '@/utils/emitter';
import { exportChatGPTContent } from '@/webview/service';
import { ChatMessage, useChatStore } from './store';

export const usePresenter = () => {
  const model = useModel();
  const chatStore = useChatStore();
  const service = new Service(model, chatStore);

  useEffect(() => {
    emitter.on('chatGPTChunk', (data) => {
      chatStore.updateMessageByChunck(
        data.sessionId,
        data.messageId,
        data.chunck,
      );
      model.listRef.current?.scrollTo(0, model.listRef.current.scrollHeight);
    });

    const initPrompt = localStorage.getItem('askChatGPT');
    let askPrompt = '';
    emitter.on('askChatGPT', (data) => {
      askPrompt = data;
      if (initPrompt && initPrompt === data) {
        return;
      }
      service.startAsk('NewSessionWithPrompt', data);
    });
    localStorage.removeItem('askChatGPT');
    if (initPrompt && initPrompt !== askPrompt) {
      service.startAsk('NewSessionWithPrompt', initPrompt);
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
    if (!model.inputChatPrompt.trim()) {
      return;
    }
    service.startAsk('NewMessage', model.inputChatPrompt);
    model.setInputChatPrompt('');
  };

  const handleCopy = (item: ChatMessage) => {
    navigator.clipboard.writeText(item.content || '');
    message.success({
      content: '内容已写入剪切板',
    });
  };

  const handleRetry = (item: ChatMessage) => {
    // if (isListItem) {
    //   service.startAsk(item?.prompt || '', '');
    // } else {
    //   service.startAsk(model.current.prompt, '');
    // }
  };

  const handleDel = (item: ChatMessage) => {};

  const handleClearContext = () => {
    message.success('上下文已清除');
  };

  const handleOpenList = () => {
    model.setListVisible(true);
  };

  const handleExportContent = () => {
    const content = chatStore
      .currentSession()
      ?.messages.map((s) =>
        s.role === 'user' ? `## ${s.content}\r\n\r\n` : `${s.content}\r\n\r\n`,
      )
      .join();
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
