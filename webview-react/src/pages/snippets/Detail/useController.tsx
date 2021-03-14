import React from 'react';
import { getLocalMaterials } from '@/webview/service';
import { useEffect } from 'react';
import { useParams } from 'umi';
import { Menu } from 'antd';
import useService from './useService';

const useController = () => {
  const params = useParams<{ name: string }>();
  const service = useService();
  const { model } = service;

  useEffect(() => {
    getLocalMaterials('snippets').then(data => {
      if (data.length) {
        const selected = data.find((s: any) => s.name === params.name);
        model.setSelectedMaterial(selected!);
        model.setFormData(model.selectedMaterial.model);
      }
    });
  }, []);

  useEffect(() => {
    model.setSelectedMaterial(s => {
      return {
        ...s,
        model: { ...s.model, ...model.formData },
      };
    });
  }, [model.formData]);

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
  };
};

export default useController;
