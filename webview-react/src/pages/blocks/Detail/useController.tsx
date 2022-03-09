import React, { useEffect } from 'react';
import { Menu } from 'antd';
import { useParams } from 'umi';
import { useForm } from 'form-render';
import useService from './useService';
import { getLocalMaterials } from '@/webview/service';

const useController = () => {
  const service = useService();
  const { model } = service;
  const params = useParams<{ name: string }>();
  const form = useForm();

  useEffect(() => {
    getLocalMaterials('blocks').then((data) => {
      model.setMaterials(data);
      if (data.length) {
        const selected = data.find((s: any) => s.name === params.name);
        model.setSelectedMaterial(selected!);
        model.setData(selected?.model);
        form.setValues(selected?.model);
      }
    });
  }, []);
  useEffect(() => {
    model.setSelectedMaterial((s) => ({
      ...s,
      model: { ...s.model, ...model.formData },
    }));
  }, [model.formData]);

  const watch = {
    '#': (val: any) => {
      model.setData(JSON.parse(JSON.stringify(val)));
    },
  };

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          model.setJsonToTsModalVisble(true);
        }}
      >
        JSON TO TS
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          model.setYapiModalVsible(true);
        }}
      >
        根据 YAPI 接口追加模板数据
      </Menu.Item>
    </Menu>
  );

  return {
    service,
    menu,
    form,
    watch,
  };
};

export default useController;
