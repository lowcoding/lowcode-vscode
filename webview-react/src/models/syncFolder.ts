import { useState } from 'react';

const useSyncFolderModal = () => {
  const [visible, setVisible] = useState(false);

  return {
    visible,
    setVisible,
  };
};

export default useSyncFolderModal;
