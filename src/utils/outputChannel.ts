import { window } from 'vscode';

const channel = window.createOutputChannel('lowcode');

export const getOutputChannel = () => channel;
