import { getPluginConfig } from '@/webview/service';
import { useForm } from 'form-render';
import React, { useEffect } from 'react';
import useService from './useService';

const useController = () => {
  const service = useService();
  const { model } = service;
  const form = useForm();

  useEffect(() => {
    getPluginConfig().then(data => {
      model.setFormDate({ ...data, saveOption: ['package'] });
      form.setValues({ ...data, saveOption: ['package'] });
    });
  }, []);

  const watch = {
    '#': (val: any) => {
      model.setFormDate(JSON.parse(JSON.stringify(val)));
    },
  };

  return {
    service,
    form,
    watch,
  };
};

export default useController;
