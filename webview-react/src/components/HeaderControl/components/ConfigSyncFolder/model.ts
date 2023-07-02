import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [syncFolder, setSyncFolder] = useState('');
  const [loading, setLoading] = useState(false);

  return {
    syncFolder,
    setSyncFolder,
    loading,
    setLoading,
  };
};

export type Model = ReturnType<typeof useModel>;
