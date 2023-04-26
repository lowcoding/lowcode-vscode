import { useState } from '@/hooks/useImmer';

const useModel = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<{
    path: string;
    name: string;
    model: object;
    schema: object;
    preview: {
      title?: string;
      description?: string;
      img?: string | string[];
      schema?: 'form-render' | 'formily' | 'amis';
    };
    template: string;
  }>({ schema: {}, model: {} } as any);
  const [materials, setMaterials] = useState<typeof selectedMaterial[]>([]);
  const [formData, setData] = useState({});
  const [yapiModalVsible, setYapiModalVsible] = useState(false);
  const [directoryModalVsible, setDirectoryModalVsible] = useState(false);
  const [jsonToTsModalVisble, setJsonToTsModalVisble] = useState(false);
  return {
    selectedMaterial,
    setSelectedMaterial,
    materials,
    setMaterials,
    formData,
    setData,
    yapiModalVsible,
    setYapiModalVsible,
    directoryModalVsible,
    setDirectoryModalVsible,
    jsonToTsModalVisble,
    setJsonToTsModalVisble,
  };
};

export default useModel;
