import { selectDirectory, useLocalScaffold } from '@/webview/service';
import { useModel } from './model';

export const usePresenter = () => {
  const model = useModel();

  const selectDirectoryByVsCode = () => {
    selectDirectory().then((res) => {
      model.setOpenFolder(res);
    });
  };

  const copyLocalScaffold = () => {
    model.setProcessing(true);
    useLocalScaffold({ localPath: model.openFolder })
      .then((res) => {
        model.setFormModal((s) => {
          s.config = res;
          s.visible = true;
        });
      })
      .finally(() => {
        model.setProcessing(false);
      });
  };

  return {
    model,
    selectDirectoryByVsCode,
    copyLocalScaffold,
  };
};
