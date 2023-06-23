import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<{
    path: string;
    name: string;
    model: object;
    schema: any;
    preview: {
      title?: string;
      description?: string;
      img?: string | string[];
      schema?: 'form-render' | 'formily' | 'amis';
      scripts?: [{ method: string; remark: string }];
    };
    template: string;
    viewPrompt?: string;
  }>({ schema: {}, model: {} } as any);
  const [materials, setMaterials] = useState<typeof selectedMaterial[]>([]);
  const [formData, setData] = useState({});
  const [yapiModalVsible, setYapiModalVsible] = useState(false);
  const [directoryModalVsible, setDirectoryModalVsible] = useState(false);
  const [jsonToTsModalVisble, setJsonToTsModalVisble] = useState(false);
  const [scriptModalVisible, setScriptModalVisible] = useState(false);

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
    scriptModalVisible,
    setScriptModalVisible,
  };
};

export type Model = ReturnType<typeof useModel>;
