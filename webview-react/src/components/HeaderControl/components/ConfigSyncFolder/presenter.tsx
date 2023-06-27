import { useModel as useUmiModel } from 'umi';
import { message } from 'antd';
import { useEffect } from 'react';
import Service from './service';
import { useModel } from './model';
import {
  selectDirectory,
  saveSyncFolder,
  getSyncFolder,
} from '@/webview/service';

export const usePresenter = () => {
  const model = useModel();
  const service = new Service(model);
  const syncFolderModal = useUmiModel('syncFolder');

  useEffect(() => {
    if (syncFolderModal.visible) {
      getSyncFolder().then((res) => {
        model.setSyncFolder(res);
      });
    }
  }, [syncFolderModal.visible]);

  const handleselectDirectory = () => {
    model.setLoading(true);
    selectDirectory()
      .then((res) => {
        if (res) {
          model.setSyncFolder(res);
        }
      })
      .finally(() => {
        model.setLoading(false);
      });
  };

  const handleOk = () => {
    saveSyncFolder(model.syncFolder).then(() => {
      message.success('保存成功');
      syncFolderModal.setVisible(false);
    });
  };

  return {
    model,
    syncFolderModal,
    handleselectDirectory,
    handleOk,
  };
};
