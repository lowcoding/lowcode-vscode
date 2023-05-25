import { useEffect } from 'react';
import Service from './service';
import { useModel } from './model';
import { askChatGPT } from '@/webview/service';
import { emitter } from '@/utils/emitter';

export const usePresenter = () => {
  const model = useModel();
  const service = new Service(model);

  useEffect(() => {
    emitter.on('chatGPTChunk', (data) => {
      service.receiveChatGPTChunk(data);
    });
    return () => {
      emitter.off('chatGPTChunk');
    };
  }, []);

  const handleSubmit = () => {
    if (!model.inputChatPrompt.trim()) {
      return;
    }
    const context = model.current.res;
    askChatGPT({ prompt: model.inputChatPrompt, context }).then((res) => {
      // console.log(222, res);
      // model.setChatRes(res);
    });
    if (model.current.prompt) {
      model.setChatList([
        ...model.chatList,
        { prompt: model.current.prompt, res: model.current.res },
      ]);
    }
    model.setCurrent((s) => {
      s.prompt = model.inputChatPrompt;
      s.res = '';
    });
    model.setInputChatPrompt('');
  };

  return {
    model,
    service,
    handleSubmit,
  };
};
