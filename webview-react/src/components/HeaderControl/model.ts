import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [blockModal, setBlockModal] = useState({
    visible: false,
    name: '',
    processing: false,
  });

  return {
    blockModal,
    setBlockModal,
  };
};
