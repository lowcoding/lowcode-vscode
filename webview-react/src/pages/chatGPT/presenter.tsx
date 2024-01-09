import { useEffect } from 'react';
import { message } from 'antd';
import Service from './service';
import { useModel } from './model';
import { emitter } from '@/utils/emitter';
import { ChatMessage, exportSession, useChatStore } from './store';
import { executeVscodeCommand } from '@/webview/service';

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

    let initPrompt = localStorage.getItem('askChatGPT');
    let askPrompt = '';
    emitter.on('askChatGPT', (data) => {
      askPrompt = data;
      if (initPrompt && initPrompt === data) {
        return;
      }
      service.startAsk('NewSessionWithPrompt', data);
    });
    if (initPrompt && initPrompt !== askPrompt) {
      service.startAsk('NewSessionWithPrompt', initPrompt);
    }
    localStorage.removeItem('askChatGPT');
    initPrompt = '';

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
    model.setListVisible(!model.listVisible);
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
    //  model.setUpdateTitleVisible(true);
    if (chatStore.currentSession().messages.length) {
      chatStore.newSession('新的会话');
    }
  };

  const handleSessionTitleOk = (title: string) => {
    chatStore.newSession(title);
    model.setUpdateTitleVisible(false);
    message.success('新建会话成功');
  };

  const handleUpdateAsContext = (message: ChatMessage) => {
    chatStore.updateMessageAsContext(
      chatStore.currentSession().id,
      message.id,
      !message.asContext,
    );
  };

  const handleSync = () => {
    message.warn('功能开发中...');
  };

  const handleAddPromptTemplate = () => {
    executeVscodeCommand({ command: 'lowcode.addPromptTemplate' });
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
    handleSessionTitleOk,
    handleSync,
    handleAddPromptTemplate,
  };
};
