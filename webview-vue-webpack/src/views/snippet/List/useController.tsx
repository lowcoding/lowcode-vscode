import useRefreshPage from '@/model/refreshPage';
import { getLocalMaterials } from '@/vscode/service';
import { onMounted, watch } from 'vue';
import useService from './useService';
const useController = () => {
  const { refresh } = useRefreshPage();

  const service = useService();
  const { model } = service;

  onMounted(() => {
    fetchData();
  });

  watch(refresh, () => {
    fetchData();
  });

  const fetchData = () => {
    getLocalMaterials('snippets').then(res => {
      model.initModel(res);
    });
  };

  return {
    service,
  };
};

export default useController;
