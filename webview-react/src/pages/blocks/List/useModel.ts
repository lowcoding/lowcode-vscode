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

  const [selectedMaterial, setSelectedMaterial] = useState<{
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
  }>({ schema: {}, model: {} } as any);

  const [directoryModalVsible, setDirectoryModalVsible] = useState(false);

  return {
    materials,
    setMaterials,
    oriMaterials,
    setOriMaterials,
    selectedMaterial,
    setSelectedMaterial,
    directoryModalVsible,
    setDirectoryModalVsible,
  };
};

export default useModel;
