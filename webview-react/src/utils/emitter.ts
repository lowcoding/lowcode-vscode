import mitt from 'mitt';

type Events = {
  chatGPTChunk: {
    text?: string | undefined;
    hasMore: boolean;
  };
};

export const emitter = mitt<Events>();
