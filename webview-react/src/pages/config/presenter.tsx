import { useForm } from 'form-render';
import React, { useEffect } from 'react';
import { getLocalMaterials, getPluginConfig } from '@/webview/service';
import Service from './service';
import { useModel } from './model';

export const usePresenter = () => {
  const model = useModel();
  const service = new Service(model);
  const form = useForm();

  useEffect(() => {
    getLocalMaterials('blocks').then((res) => {
      form.setSchemaByPath('commonlyUsedBlock', {
        enum: res.map((s) => s.name),
        enumNames: res.map((s) => s.name),
      });
    });
    getPluginConfig().then((data) => {
      model.setFormDate(data);
      form.setValues(data);
    });
  }, []);

  const watch = {
    '#': (val: any) => {
      model.setFormDate(JSON.parse(JSON.stringify(val)));
    },
  };

  return {
    model,
    service,
    form,
    watch,
  };
};
