import mitt from 'mitt';

type Events = {
  chatGPTChunk: {
    text?: string | undefined;
    hasMore: boolean;
  };
  askChatGPT: string;
};

export const emitter = mitt<Events>();
