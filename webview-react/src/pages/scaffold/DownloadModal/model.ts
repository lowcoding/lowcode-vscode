import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [formData, setFormData] = useState<{
    type: 'git' | 'npm';
    url: string;
  }>({} as any);

  const [processing, setProcessing] = useState(false);

  const [formModal, setFormModal] = useState<{ visible: boolean; config: any }>(
    {
      visible: false,
      config: {},
    },
  );

  return {
    formData,
    setFormData,
    processing,
    setProcessing,
    formModal,
    setFormModal,
  };
};

export type Model = ReturnType<typeof useModel>;
