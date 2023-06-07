import { useEffect } from 'react';
import { message } from 'antd';
import Service from './service';
import { useModel } from './model';
import { emitter } from '@/utils/emitter';
import { ChatMessage, exportSession, useChatStore } from './store';

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
    const seesion = chatStore.currentSession();
    if (seesion) {
      const prompt = seesion.messages.find(
        (s) => s.id === item.id && s.role === 'user',
      );
      if (prompt) {
        chatStore.delMessage(chatStore.currentSession().id, item.id);
        setTimeout(() => {
          service.startAsk('NewMessage', prompt.content);
        }, 200);
      }
    }
  };

  const handleDel = (messageId: number) => {
    chatStore.delMessage(chatStore.currentSession().id, messageId);
  };

  const handleOpenList = () => {
    model.setListVisible(true);
  };

  const handleExportContent = () => {
    exportSession(chatStore.currentSession()).then(() => {
      message.success('导出成功');
    });
  };

  const handleClearContext = () => {
    chatStore.removeSessionContext(chatStore.currentSession().id);
    message.success('上下文已清除');
  };

  const handleNewSession = () => {
    chatStore.newSession();
  };

  const handleUpdateAsContext = (message: ChatMessage) => {
    chatStore.updateMessageAsContext(
      chatStore.currentSession().id,
      message.id,
      !message.asContext,
    );
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
    handleNewSession,
    handleUpdateAsContext,
  };
};
