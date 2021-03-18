import { getLocalMaterials } from '@/webview/service';
import React, { useEffect } from 'react';
import { Menu } from 'antd';
import { useParams } from 'umi';
import useService from './useService';

const useController = () => {
  const service = useService();
  const { model } = service;
  const params = useParams<{ name: string }>();

  useEffect(() => {
    getLocalMaterials('blocks').then(data => {
      model.setMaterials(data);
      if (data.length) {
        const selected = data.find((s: any) => s.name === params.name);
        model.setSelectedMaterial(selected!);
        model.setData(selected?.model);
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
    </Menu>
  );

  return {
    service,
    menu,
  };
};

export default useController;
