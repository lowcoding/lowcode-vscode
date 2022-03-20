import { message } from 'antd';
import { IDownloadMaterialsResult, saveDownloadMaterials } from '@/webview/service';
import { useModel } from './model';
import Service from './service';

export const usePresenter = () => {
  const model = useModel();
  const service = new Service(model);

  const handleDownloadMaterialsOk = (materials: IDownloadMaterialsResult) => {
    if (materials.blocks.length === 0 && materials.snippets.length === 0) {
      message.warn('未设置物料');
    }
    model.setDownloadMaterialsVisible(false);
    model.setMaterials(materials);
    model.setSelectedMaterials({
      blocks: [],
      snippets: [],
    });
  };

  const handleCheckItem = (key: string) => {
    if (model.tab === 'blocks') {
      if (model.selectedMaterials.blocks.includes(key)) {
        model.setSelectedMaterials((s) => {
          s.blocks = s.blocks.filter((b) => b !== key);
        });
      } else {
        model.setSelectedMaterials((s) => {
          s.blocks = [...s.blocks, key];
        });
      }
    } else if (model.selectedMaterials.snippets.includes(key)) {
      model.setSelectedMaterials((s) => {
        s.snippets = s.snippets.filter((b) => b !== key);
      });
    } else {
      model.setSelectedMaterials((s) => {
        s.snippets = [...s.snippets, key];
      });
    }
  };

  const handleConfirm = () => {
    if (
      model.selectedMaterials.blocks.length === 0 &&
      model.selectedMaterials.snippets.length === 0
    ) {
      message.warn('请选择物料');
      return;
    }
    saveDownloadMaterials(model.selectedMaterials).then(() => {
      message.success('保存成功');
    });
  };

  return {
    model,
    service,
    handleDownloadMaterialsOk,
    handleCheckItem,
    handleConfirm,
  };
};
