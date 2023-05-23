import { Model } from './model';

export default class Service {
  private model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  receiveChatGPTChunk(data: { text?: string | undefined; hasMore: boolean }) {
    this.model.setCurrent((s) => {
      s.res += data.text;
    });
  }
}
