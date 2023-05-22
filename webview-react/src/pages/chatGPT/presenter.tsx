import Service from './service';
import { useModel } from './model';
import { askChatGPT } from '@/webview/service';

export const usePresenter = () => {
  const model = useModel();
  const service = new Service(model);

  const handleSubmit = () => {
    askChatGPT({ prompt: model.chatPrompt }).then((res) => {
      console.log(222, res);
      model.setChatRes(res);
    });
  };

  return {
    model,
    service,
    handleSubmit,
  };
};
