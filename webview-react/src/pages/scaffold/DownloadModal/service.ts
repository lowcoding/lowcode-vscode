import { Model } from './model';

export default class Service {
  private model: Model;

  constructor(model: Model) {
    this.model = model;
  }
}
