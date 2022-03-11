import alert from '../controllers/alert';
import material from '../controllers/material';

export const routes: Record<string, any> = {
  alert: alert.alert,
  getLocalMaterials: material.getLocalMaterials,
};
