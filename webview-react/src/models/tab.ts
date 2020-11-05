import { useState } from 'react';

const useTab = () => {
  const [tab, setTab] = useState('/snippets');
  const [refresh, setRefresh] = useState(false);
  return {
    tab,
    setTab,
    refresh,
    setRefresh,
  };
};
export default useTab;
