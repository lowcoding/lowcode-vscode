export interface IMessage<T = any> {
  cmd: string;
  cbid: string;
  data: T;
}
