import { useMount } from 'ahooks';
import { nodeRequest } from '@/webview/service';
import { useState } from './useImmer';

const useCheckVankeInternal = () => {
  const [isVankeInternal, setIsVankeInternal] = useState<boolean | undefined>(
    undefined,
  );

  useMount(() => {
    nodeRequest({ url: 'https://yapi.onewo.com' })
      .then(() => {
        setIsVankeInternal(true);
      })
      .catch(() => {
        setIsVankeInternal(false);
      });
  });

  return isVankeInternal;
};

export default useCheckVankeInternal;
