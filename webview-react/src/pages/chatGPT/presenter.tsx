import { useEffect } from 'react';
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

  const handleSubmit = () => {
    if (!model.inputChatPrompt.trim() || model.loading) {
      return;
    }
    const context = model.current.res;
    service.startAsk(model.inputChatPrompt, context);
    model.setInputChatPrompt('');
  };

  return {
    model,
    service,
    handleSubmit,
  };
};
