import mitt from 'mitt';

type Events = {
  chatGPTChunk: string;
};

export const emitter = mitt<Events>();
