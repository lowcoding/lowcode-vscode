import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  id: number;
  loading?: boolean;
};

type ChatSession = {
  id: number;
  topic: string;
  messages: ChatMessage[];
};

type ChatStore = {
  sessions: ChatSession[];
  currentSessionIndex: number;
  currentSession: () => ChatSession;
  newSession: () => void;
  newSessionWithPrompt: (prompt: string) => {
    sessionId: number;
    messageId: number;
  };
  newMessage: (
    sessionId: number,
    prompt: string,
  ) => {
    sessionId: number;
    messageId: number;
  };
  updateMessageByChunck: (
    sessionId: number,
    messageId: number,
    chunck: string,
  ) => void;
};

const createEmptySession: () => ChatSession = () => ({
  id: new Date().getTime(),
  topic: '新的话题',
  messages: [],
});

export const useChatStore = create<ChatStore>()(
  persist(
    (setState, getStore) => ({
      sessions: [],
      currentSessionIndex: 0,
      currentSession() {
        const sessions = getStore().sessions;
        const index = getStore().currentSessionIndex;
        const session = sessions[index] || 0;
        return session;
      },
      newSession() {
        const session = createEmptySession();
        setState((state) => ({
          currentSessionIndex: 0,
          sessions: [session].concat(state.sessions),
        }));
      },
      newSessionWithPrompt(prompt: string) {
        const session = createEmptySession();
        const id = new Date().getTime();
        session.messages = [
          {
            id,
            content: prompt,
            role: 'user',
            loading: true,
          },
          {
            id,
            content: '',
            role: 'assistant',
            loading: true,
          },
        ];
        setState((state) => ({
          currentSessionIndex: 0,
          sessions: [session].concat(state.sessions),
        }));
        return {
          sessionId: session.id,
          messageId: id,
        };
      },
      newMessage(sessionId: number, prompt: string) {
        const sessions = getStore().sessions;
        const session = sessions.find((s) => s.id === sessionId);
        const messageId = new Date().getTime();
        if (session) {
          session.messages = [
            ...session.messages,
            { id: messageId, content: prompt, role: 'user' },
            { id: messageId, content: '', role: 'assistant', loading: true },
          ];
        }
        setState(() => ({ sessions }));
        return {
          sessionId,
          messageId,
        };
      },
      updateMessageByChunck(
        sessionId: number,
        messageId: number,
        chunck: string,
      ) {
        const sessions = getStore().sessions;
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
          const message = session.messages.find(
            (s) => s.id === messageId && s.role === 'assistant',
          );
          if (message) {
            message.content += chunck;
          }
        }
        setState(() => ({ sessions }));
      },
    }),
    { name: 'lowcode.ChatStore' },
  ),
);
