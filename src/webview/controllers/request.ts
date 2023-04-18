import axios, { AxiosRequestConfig } from 'axios';
import { IMessage } from '../type';

export const axiosRequest = async (
  message: IMessage<{
    config: AxiosRequestConfig;
  }>,
) => {
  const res = await axios.request(message.data.config);
  return res.data;
};
