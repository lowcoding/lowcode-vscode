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
  newSessionWithPrompt: (prompt: string) => void;
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
        session.messages = [
          {
            id: new Date().getTime(),
            content: prompt,
            role: 'user',
          },
        ];
        setState((state) => ({
          currentSessionIndex: 0,
          sessions: [session].concat(state.sessions),
        }));
      },
      updateMessageByChunck(
        sessionId: number,
        messageId: number,
        chunck: string,
      ) {
        const sessions = getStore().sessions;
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
          const message = session.messages.find((s) => s.id === messageId);
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
