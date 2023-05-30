import { askChatGPT } from '@/webview/service';
import { Model } from './model';

let globalPrompt = ''; // emitter 回调中获取不到最新 state ，使用全局变量
let globalRes = '';
export default class Service {
  private model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  receiveChatGPTChunk(data: { text?: string | undefined; hasMore: boolean }) {
    this.model.setCurrent((s) => {
      s.res += data.text;
    });
    globalRes += data.text;
  }

  startAsk(prompt: string, context: string) {
    if (!prompt.trim() || this.model.loading) {
      return;
    }
    this.model.setLoading(true);
    this.model.setComplete((s) => false);
    if (globalPrompt) {
      this.model.setChatList((s) => {
        const ss = [
          ...s,
          {
            prompt: globalPrompt,
            res: globalRes,
            key: new Date().getTime(),
          },
        ];
        return ss;
      });
    }
    this.model.setCurrent((s) => {
      s.prompt = '';
      s.res = '';
    });
    askChatGPT({ prompt, context })
      .then(() => {
        this.model.setComplete((s) => true);
      })
      .finally(() => {
        this.model.setLoading(false);
      });
    this.model.listRef.current?.scrollTo(
      0,
      this.model.listRef.current.scrollHeight,
    );
    setTimeout(() => {
      this.model.setCurrent((s) => {
        s.prompt = prompt;
        s.res = '';
      });
      globalPrompt = prompt;
      globalRes = '';
    }, 50);
    setTimeout(() => {
      this.model.listRef.current?.scrollTo(
        0,
        this.model.listRef.current.scrollHeight,
      );
    }, 2000);
  }
}
