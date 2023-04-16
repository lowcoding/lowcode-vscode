import { useMount } from 'ahooks';
import { request } from 'umi';
import { useState } from './useImmer';

const useCheckVankeInternal = () => {
  const [isVankeInternal, setIsVankeInternal] = useState<boolean | undefined>(
    undefined,
  );

  useMount(() => {
    request('https://yapi.onewo.com', { skipErrorHandler: true })
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
