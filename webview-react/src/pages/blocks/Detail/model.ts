import { useRef } from 'react';
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
      scripts?: [
        { method: string; remark: string; readClipboardImage?: boolean },
      ];
    };
    template: string;
    viewPrompt?: string;
    privateMaterials?: boolean;
  }>({ schema: {}, model: {} } as any);
  const [materials, setMaterials] = useState<typeof selectedMaterial[]>([]);
  const [directoryModalVsible, setDirectoryModalVsible] = useState(false);
  const [scriptModalVisible, setScriptModalVisible] = useState(false);

  const amisComponent = useRef<{
    getValues: () => object;
    setValues: (values: object) => void;
  } | null>(null);

  const formilyComponent = useRef<{
    getValues: () => object;
    setValues: (values: object) => void;
  } | null>(null);

  const [loading, setLoding] = useState(false);

  const [tempFormDataModal, setTempFormDataModal] = useState<{
    visible: boolean;
    formData: object;
  }>({ visible: false, formData: {} });

  return {
    selectedMaterial,
    setSelectedMaterial,
    materials,
    setMaterials,
    directoryModalVsible,
    setDirectoryModalVsible,
    scriptModalVisible,
    setScriptModalVisible,
    amisComponent,
    formilyComponent,
    loading,
    setLoding,
    tempFormDataModal,
    setTempFormDataModal,
  };
};

export type Model = ReturnType<typeof useModel>;
