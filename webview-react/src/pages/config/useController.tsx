import { getPluginConfig } from '@/webview/service';
import React, { useEffect } from 'react';
import useService from './useService';

const useController = () => {
  const service = useService();
  const { model } = service;

  useEffect(() => {
    getPluginConfig().then(data => {
      model.setFormDate({ ...data, saveOption: ['package'] });
    });
  }, []);

  return {
    service,
  };
};

export default useController;
