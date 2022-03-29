import { useDebounceFn, useMount } from 'ahooks';
import { useEffect } from 'react';
import { useModel as umiModel } from 'umi';
import { useModel } from './model';
import Service from './service';

export const usePresenter = () => {
  const model = useModel();
  const service = new Service(model);

  const { refresh, setRefresh } = umiModel('tab');

  useMount(() => {
    service.getList().finally(() => {
      setRefresh(false);
    });
  });

  useEffect(() => {
    if (refresh) {
      service.getList().finally(() => {
        setRefresh(false);
      });
    }
  }, [refresh]);

  const handleSearch = useDebounceFn(
    () => {
      service.search();
    },
    { wait: 300 },
  ).run;

  return {
    model,
    handleSearch,
  };
};
