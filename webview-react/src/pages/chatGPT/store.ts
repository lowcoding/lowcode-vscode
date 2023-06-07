import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { exportChatGPTContent } from '@/webview/service';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  id: number;
  loading?: boolean;
  asContext: boolean;
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
  changeSession: (index: number) => void;
  newSession: () => ChatSession;
  newSessionWithPrompt: (prompt: string) => ChatSession;
  delSeesion: (sessionId: number) => void;
  removeSessionContext: (seeesionId: number) => void;
  newMessage: (prompt: string) => ChatSession;
  delMessage: (sessionId: number, messageId: number) => void;
  updateMessageAsContext: (
    sessionId: number,
    messageId: number,
    asContext: boolean,
  ) => void;
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
      changeSession(index: number) {
        setState(() => ({ currentSessionIndex: index }));
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
            asContext: true,
          },
          {
            id,
            content: '',
            role: 'assistant',
            loading: true,
            asContext: true,
          },
        ];
        setState((state) => ({
          currentSessionIndex: 0,
          sessions: [session].concat(state.sessions),
        }));
        return session;
      },
      delSeesion(sessionId: number) {
        const sesssions = getStore().sessions;
        setState(() => ({
          sessions: sesssions.filter((s) => s.id !== sessionId),
        }));
      },
      removeSessionContext(seeesionId: number) {
        const sessions = getStore().sessions;
        const session = sessions.find((s) => s.id === seeesionId);
        if (session) {
          session.messages.forEach((s) => {
            s.asContext = false;
          });
          setState(() => ({ sessions }));
        }
      },
      newMessage(prompt: string) {
        let sessions = getStore().sessions;
        let session = getStore().currentSession();
        const messageId = new Date().getTime();
        if (session) {
          session.messages = [
            ...session.messages,
            { id: messageId, content: prompt, role: 'user', asContext: true },
            {
              id: messageId,
              content: '',
              role: 'assistant',
              loading: true,
              asContext: true,
            },
          ];
        } else {
          session = getStore().newSession();
          session.messages = [
            { id: messageId, content: prompt, role: 'user', asContext: true },
            {
              id: messageId,
              content: '',
              role: 'assistant',
              loading: true,
              asContext: true,
            },
          ];
          sessions = [session, ...sessions];
        }
        setState(() => ({ sessions }));
        return session;
      },
      delMessage(sessionId: number, messageId: number) {
        const sessions = getStore().sessions;
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
          session.messages = session.messages.filter((s) => s.id !== messageId);
          setState(() => ({ sessions }));
        }
      },
      updateMessageAsContext(
        sessionId: number,
        messageId: number,
        asContext: boolean,
      ) {
        const sessions = getStore().sessions;
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
          const messages = session.messages.filter((s) => s.id === messageId);
          if (messages.length) {
            messages.forEach((s) => {
              s.asContext = asContext;
            });
            setState(() => ({ sessions }));
          }
        }
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
            setState(() => ({ sessions }));
          }
        }
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

export const exportSession = (session?: ChatSession) => {
  let content = `### ${session?.topic || '新的话题'}\r\n\r\n`;
  content += session?.messages
    .map((s) =>
      s.role === 'user'
        ? `问： \r\n\r\n${s.content}\r\n\r\n`
        : `答： \r\n\r\n${s.content}\r\n\r\n`,
    )
    .join('');
  return exportChatGPTContent(content || '');
};
