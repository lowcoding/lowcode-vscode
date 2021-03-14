import { useState } from '@/hooks/useImmer';

const useModel = () => {
  const [materials, setMaterials] = useState<
    {
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
    }[]
  >([]);
  const [oriMaterials, setOriMaterials] = useState<typeof materials>([]);
  return {
    materials,
    setMaterials,
    oriMaterials,
    setOriMaterials,
  };
};

export default useModel;
