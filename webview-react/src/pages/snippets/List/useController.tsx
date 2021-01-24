import { getLocalMaterials } from '@/webview/service';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import useService from './useService';

const useController = () => {
  const service = useService();
  const { model } = service;

  const { refresh, setRefresh } = useModel('tab');

  useEffect(() => {
    getList();
  }, []);
  useEffect(() => {
    if (refresh) {
      getList();
    }
  }, [refresh]);

  const getList = () => {
    getLocalMaterials('snippets')
      .then(data => {
        model.setMaterials(data);
        model.setOriMaterials(data);
      })
      .finally(() => {
        setRefresh(false);
      });
  };

  return {
    service,
  };
};

export default useController;
