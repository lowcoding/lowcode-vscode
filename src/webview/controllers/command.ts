import { commands, Uri } from 'vscode';
import { IMessage } from '../type';

const command = {
  executeVscodeCommand: (message: IMessage<{ command: string }>) => {
    commands.executeCommand(message.data.command);
  },
  openUri: (message: IMessage<string>) => {
    commands.executeCommand('vscode.openFolder', Uri.file(message.data), true);
  },
};

export default command;
