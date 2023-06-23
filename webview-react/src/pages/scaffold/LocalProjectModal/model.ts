import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [processing, setProcessing] = useState(false);

  const [formModal, setFormModal] = useState<{ visible: boolean; config: any }>(
    {
      visible: false,
      config: {},
    },
  );

  const [openFolder, setOpenFolder] = useState('');

  return {
    processing,
    setProcessing,
    formModal,
    setFormModal,
    openFolder,
    setOpenFolder,
  };
};

export type Model = ReturnType<typeof useModel>;
