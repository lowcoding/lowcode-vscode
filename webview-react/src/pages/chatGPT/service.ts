import { askChatGPT } from '@/webview/service';
import { Model } from './model';
import { ChatMessage, ChatStore } from './store';

let globalPrompt = ''; // emitter 回调中获取不到最新 state ，使用全局变量
let globalRes = '';
export default class Service {
  private model: Model;

  private chatStore: ChatStore;

  constructor(model: Model, chatStore: ChatStore) {
    this.model = model;
    this.chatStore = chatStore;
  }

  receiveChatGPTChunk(data: { text?: string | undefined }) {
    this.model.setCurrent((s) => {
      s.res += data.text;
    });
    globalRes += data.text;
  }

  startAsk(type: 'NewSessionWithPrompt' | 'NewMessage', prompt: string) {
    let sessionId = 0;
    let messageId = 0;
    let messages: Pick<ChatMessage, 'role' | 'content'>[] = [];
    if (type === 'NewSessionWithPrompt') {
      const session = this.chatStore.newSessionWithPrompt(prompt);
      sessionId = session.id;
      messageId = session.messages[0].id;
      messages = session.messages.filter((s) => s.content);
    } else if (type === 'NewMessage') {
      const session = this.chatStore.newMessage(prompt);
      sessionId = session.id;
      messageId = session.messages[session.messages.length - 1].id;
      messages = session.messages.filter((s) => s.content);
    }
    askChatGPT({ sessionId, messageId, messages }).finally(() => {
      this.model.setLoading(false);
      this.model.setComplete((s) => true);
    });
    // this.model.listRef.current?.scrollTo(
    //   0,
    //   this.model.listRef.current.scrollHeight,
    // );
    // setTimeout(() => {
    //   this.model.setCurrent((s) => {
    //     s.prompt = prompt;
    //     s.res = '';
    //   });
    //   globalPrompt = prompt;
    //   globalRes = '';
    // }, 50);
    // setTimeout(() => {
    //   this.model.listRef.current?.scrollTo(
    //     0,
    //     this.model.listRef.current.scrollHeight,
    //   );
    // }, 2000);
  }

  delItem(isListItem: boolean, item?: Model['chatList'][0]) {
    if (isListItem) {
      this.model.setChatList((s) => s.filter((p) => p.key !== item?.key));
    } else {
      this.model.setCurrent((s) => {
        s.prompt = '';
        s.res = '';
      });
      globalPrompt = '';
      globalRes = '';
    }
  }

  resetCurrent() {
    if (globalPrompt) {
      const prompt = globalPrompt;
      const res = globalRes;
      this.model.setChatList((s) => {
        const ss = [
          ...s,
          {
            prompt,
            res,
            key: new Date().getTime(),
          },
        ];
        return ss;
      });
      this.model.setCurrent((s) => {
        s.prompt = '';
        s.res = '';
      });
      globalPrompt = '';
      globalRes = '';
    }
  }
}
