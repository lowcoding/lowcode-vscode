import React, { useEffect } from 'react';
import { Menu, message } from 'antd';
import { useParams } from 'umi';
import { useForm } from 'form-render';
import useService from './useService';
import {
  askChatGPTWithEjsTemplate,
  getLocalMaterials,
} from '@/webview/service';

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
        if (selected && !selected.preview.schema) {
          selected.preview.schema = 'form-render';
        }
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

  const handleAskChatGPT = () => {
    if (!model.selectedMaterial.preview.chatGPT?.viewPrompt) {
      message.warn('未配置 preview.chatGPT.viewPrompt');
    }
    askChatGPTWithEjsTemplate({
      template:
        model.selectedMaterial.preview.chatGPT?.viewPrompt || '<%- model %>',
      model: { model: JSON.stringify(model.selectedMaterial.model, null, 2) },
    });
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
    handleAskChatGPT,
  };
};

export default useController;
