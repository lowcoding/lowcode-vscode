import { reactive } from 'vue';

const useModel = () => {
  const selectedMaterial = reactive<{
    data: {
      path: string;
      name: string;
      model: object;
      schema: object;
      preview: {
        title?: string;
        description?: string;
        img?: string;
      };
      template: string;
    };
  }>({ data: { schema: {}, model: {} } } as any);

  const dialogVisible = reactive<{ jsonToTs: boolean; yapi: boolean }>({
    jsonToTs: false,
    yapi: false,
  });

  return {
    selectedMaterial,
    dialogVisible,
  };
};

export default useModel;
