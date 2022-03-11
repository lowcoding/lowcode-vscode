import { window } from 'vscode';
import { IMessage } from '../type';

const alert = {
  alert: (message: IMessage<string>) => {
    window.showErrorMessage(message.data);
    return '来自vscode的响应';
  },
};

export default alert;
