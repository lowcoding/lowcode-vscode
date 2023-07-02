import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<{
    path: string;
    name: string;
    model: any;
    schema: any;
    preview: {
      title: string;
      description: string;
      img?: string[] | string;
      schema?: 'form-render' | 'formily' | 'amis';
      scripts?: [{ method: string; remark: string }];
    };
    template: string;
    viewPrompt?: string;
    privateMaterials?: boolean;
  }>({ schema: {}, model: {} } as any);
  const [formData, setFormData] = useState({});
  const [yapiModalVsible, setYapiModalVsible] = useState(false);
  const [templateModalVisble, setTemplateModalVisble] = useState(false);
  const [jsonToTsModalVisble, setJsonToTsModalVisble] = useState(false);
  const [scriptModalVisible, setScriptModalVisible] = useState(false);

  return {
    selectedMaterial,
    setSelectedMaterial,
    formData,
    setFormData,
    yapiModalVsible,
    setYapiModalVsible,
    jsonToTsModalVisble,
    setJsonToTsModalVisble,
    templateModalVisble,
    setTemplateModalVisble,
    scriptModalVisible,
    setScriptModalVisible,
  };
};

export type Model = ReturnType<typeof useModel>;
