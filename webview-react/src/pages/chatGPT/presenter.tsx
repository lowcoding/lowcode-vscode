import { useEffect } from 'react';
import { message } from 'antd';
import Service from './service';
import { useModel } from './model';
import { emitter } from '@/utils/emitter';

export const usePresenter = () => {
  const model = useModel();
  const service = new Service(model);

  useEffect(() => {
    emitter.on('chatGPTChunk', (data) => {
      service.receiveChatGPTChunk(data);
      model.listRef.current?.scrollTo(0, model.listRef.current.scrollHeight);
    });

    emitter.on('askChatGPT', (data) => {
      service.startAsk(data, '');
    });

    const initPrompt = localStorage.getItem('askChatGPT');
    localStorage.removeItem('askChatGPT');
    if (initPrompt && initPrompt !== model.current.prompt) {
      service.startAsk(initPrompt, '');
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
    const context = model.current.res;
    service.startAsk(model.inputChatPrompt, context);
    model.setInputChatPrompt('');
  };

  const handleCopy = (isListItem: boolean, item?: typeof model.chatList[0]) => {
    if (isListItem) {
      navigator.clipboard.writeText(item?.res || '');
    } else {
      navigator.clipboard.writeText(model.current.res || '');
    }
    message.success('已写入剪切板');
  };

  const handleRetry = (
    isListItem: boolean,
    item?: typeof model.chatList[0],
  ) => {};

  const handleDel = (
    isListItem: boolean,
    item?: typeof model.chatList[0],
  ) => {};

  return {
    model,
    service,
    handleSubmit,
    handleInputKeyDown,
    handleCopy,
    handleRetry,
    handleDel,
  };
};
