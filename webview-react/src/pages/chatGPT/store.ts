import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type ChatMessage = {
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

export type ChatStore = {
  sessions: ChatSession[];
  currentSessionIndex: number;
  currentSession: () => ChatSession;
  newSession: () => ChatSession;
  newSessionWithPrompt: (prompt: string) => ChatSession;
  newMessage: (prompt: string) => ChatSession;
  updateMessageByChunck: (
    sessionId: number,
    messageId: number,
    chunck: string,
  ) => void;
  updateMessageLoading: (sessionId: number, messageId: number) => void;
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
        const session = sessions[index || 0];
        return session;
      },
      newSession() {
        const session = createEmptySession();
        setState((state) => ({
          currentSessionIndex: 0,
          sessions: [session].concat(state.sessions),
        }));
        return session;
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
        return session;
      },
      newMessage(prompt: string) {
        let sessions = getStore().sessions;
        let session = getStore().currentSession();
        const messageId = new Date().getTime();
        if (session) {
          session.messages = [
            ...session.messages,
            { id: messageId, content: prompt, role: 'user' },
            { id: messageId, content: '', role: 'assistant', loading: true },
          ];
        } else {
          session = getStore().newSession();
          session.messages = [
            { id: messageId, content: prompt, role: 'user' },
            { id: messageId, content: '', role: 'assistant', loading: true },
          ];
          sessions = [session, ...sessions];
        }
        setState(() => ({ sessions }));
        return session;
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
      updateMessageLoading(sessionId: number, messageId: number) {
        const sessions = getStore().sessions;
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
          const message = session.messages.find(
            (s) => s.id === messageId && s.role === 'assistant',
          );
          if (message) {
            message.loading = false;
            setState(() => ({ sessions }));
          }
        }
      },
    }),
    { name: 'lowcode.ChatStore' },
  ),
);