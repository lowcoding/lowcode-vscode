import { IGetLocalMaterialsResult } from '@/vscode/service';
import { reactive } from 'vue';

const useModel = () => {
  const materials = reactive<{
    list: IGetLocalMaterialsResult[];
  }>({ list: [] });

  const oriMaterials = reactive<typeof materials>({ list: [] });
  const initModel = (data: IGetLocalMaterialsResult[]) => {
    materials.list = data;
    oriMaterials.list = data;
  };

  return {
    materials,
    oriMaterials,
    initModel,
  };
};

export default useModel;
