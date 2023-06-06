import mitt from 'mitt';

type Events = {
  chatGPTChunk: {
    chunck: string;
    sessionId: number;
    messageId: number;
  };
  askChatGPT: string;
};

export const emitter = mitt<Events>();
