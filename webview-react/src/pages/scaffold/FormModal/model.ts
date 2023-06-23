import { useState } from '@/hooks/useImmer';

export const defaultConfig = {
  projectName: '',
  createDir: '',
  immediateOpen: true,
};

export const useModel = () => {
  const [formData, setFormData] = useState<any>({});

  const [config, setConfig] = useState<{
    projectName: string;
    createDir: string;
    immediateOpen: boolean;
  }>(defaultConfig);

  return {
    formData,
    setFormData,
    config,
    setConfig,
  };
};

export type Model = ReturnType<typeof useModel>;
