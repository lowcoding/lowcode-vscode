import { commands } from 'vscode';
import { IMessage } from '../type';

const command = {
  executeVscodeCommand: (message: IMessage<{ command: string }>) => {
    commands.executeCommand(message.data.command);
  },
};

export default command;
