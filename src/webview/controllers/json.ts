import { json2Ts } from '../../utils/json';
import { IMessage } from '../type';

export const jsonToTs = async (
  message: IMessage<{ json: object; typeName: string }>,
) => {
  const type = await json2Ts(message.data.json, message.data.typeName);
  return type;
};
