import React, { useEffect } from 'react';
import { useParams } from 'umi';
import { Menu } from 'antd';
import { useForm } from 'form-render';
import { getLocalMaterials } from '@/webview/service';
import useService from './useService';

const useController = () => {
  const params = useParams<{ name: string }>();
  const service = useService();
  const { model } = service;
  const form = useForm();

  useEffect(() => {
    getLocalMaterials('snippets').then((data) => {
      if (data.length) {
        const selected = data.find((s: any) => s.name === params.name);
        model.setSelectedMaterial(selected!);
        model.setFormData(selected?.model);
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
      model.setFormData(JSON.parse(JSON.stringify(val)));
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
      <Menu.Item
        onClick={() => {
          model.setTemplateModalVisble(true);
        }}
      >
        编辑模板
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
