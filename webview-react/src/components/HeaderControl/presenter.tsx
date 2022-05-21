import { message } from 'antd';
import { createBlockTemplate } from '@/webview/service';
import { useModel } from './model';

export const usePresenter = () => {
  const model = useModel();

  const closeBlockModal = () => {
    model.setBlockModal((s) => {
      s.visible = false;
      s.name = '';
    });
  };

  const createBlock = () => {
    if (!model.blockModal.name) {
      return;
    }
    model.setBlockModal((s) => {
      s.processing = true;
    });
    createBlockTemplate({
      name: model.blockModal.name,
      template: '在当前文件夹下放区块模板，并将此文件删除',
      model: '{}',
      schema: '{}',
      preview: JSON.stringify(
        {
          title: model.blockModal.name,
          description: model.blockModal.name,
          img: 'https://fastly.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg',
          category: [],
        },
        null,
        2,
      ),
    })
      .then(() => {
        closeBlockModal();
        message.success('创建成功');
      })
      .finally(() => {
        model.setBlockModal((s) => {
          s.processing = false;
        });
      });
  };

  return { model, closeBlockModal, createBlock };
};
