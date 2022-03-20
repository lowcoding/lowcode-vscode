import alert from '../controllers/alert';
import material from '../controllers/material';
import command from '../controllers/command';

export const routes: Record<string, any> = {
  alert: alert.alert,
  downloadMaterials: material.downloadMaterials,
  getLocalMaterials: material.getLocalMaterials,
  saveDownloadMaterials: material.saveDownloadMaterials,
  executeVscodeCommand: command.executeVscodeCommand,
};
