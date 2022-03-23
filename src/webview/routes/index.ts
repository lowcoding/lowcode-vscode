import alert from '../controllers/alert';
import material from '../controllers/material';
import command from '../controllers/command';
import * as scaffold from '../controllers/scaffold';

export const routes: Record<string, any> = {
  alert: alert.alert,
  downloadMaterials: material.downloadMaterials,
  getLocalMaterials: material.getLocalMaterials,
  saveDownloadMaterials: material.saveDownloadMaterials,
  executeVscodeCommand: command.executeVscodeCommand,
  getScaffolds: scaffold.getScaffolds,
  downloadScaffold: scaffold.downloadScaffold,
  selectDirectory: scaffold.selectDirectory,
  createProject: scaffold.createProject,
};
