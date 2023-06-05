import mitt from 'mitt';

type Events = {
  chatGPTChunk: {
    chunck: string;
    sessionId: number;
    messageId: number;
    hasMore: boolean;
  };
  askChatGPT: string;
};

export const emitter = mitt<Events>();
