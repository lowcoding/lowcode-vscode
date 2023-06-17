import { useState } from '@/hooks/useImmer';

const useModel = () => {
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
    };
    template: string;
    viewPrompt?: string;
  }>({ schema: {}, model: {} } as any);
  const [formData, setFormData] = useState({});
  const [yapiModalVsible, setYapiModalVsible] = useState(false);
  const [templateModalVisble, setTemplateModalVisble] = useState(false);
  const [jsonToTsModalVisble, setJsonToTsModalVisble] = useState(false);

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
  };
};

export default useModel;
