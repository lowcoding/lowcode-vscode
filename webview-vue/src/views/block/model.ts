import { reactive, readonly } from 'vue';
import { IGetLocalMaterialsResult } from '../../vscode/service';

const useModel = () => {
  const materials = reactive<{
    list: IGetLocalMaterialsResult[];
  }>({ list: [] });
  const oriMaterials = reactive<typeof materials>({ list: [] });
  const initModel = (data: IGetLocalMaterialsResult[]) => {
    materials.list = data;
    oriMaterials.list = data;
  };
  const search = (value: string) => {
    if (!value.trim()) {
      materials.list = oriMaterials.list;
    } else {
      materials.list = oriMaterials.list.filter((s) => {
        return (
          s.name.indexOf(value) > -1 ||
          (s.preview.title && s.preview.title.indexOf(value) > -1) ||
          (s.preview.description && s.preview.description.indexOf(value) > -1)
        );
      });
    }
  };
  return {
    materials: readonly(materials),
    oriMaterials: readonly(oriMaterials),
    initModel,
    search,
  };
};
export default useModel;
