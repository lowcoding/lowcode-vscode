import { askChatGPT } from '@/webview/service';
import { Model } from './model';
import { ChatMessage, ChatStore } from './store';

export default class Service {
  private model: Model;

  private chatStore: ChatStore;

  constructor(model: Model, chatStore: ChatStore) {
    this.model = model;
    this.chatStore = chatStore;
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
      this.chatStore.updateMessageLoading(sessionId, messageId);
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
}
