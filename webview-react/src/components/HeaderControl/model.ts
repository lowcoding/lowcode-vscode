import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [blockModal, setBlockModal] = useState({
    visible: false,
    name: '',
    schemaType: 'amis',
    private: false,
    processing: false,
  });

  return {
    blockModal,
    setBlockModal,
  };
};
