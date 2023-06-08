import React, { useEffect } from 'react';
import { useParams } from 'umi';
import { Menu, message } from 'antd';
import { useForm } from 'form-render';
import {
  askChatGPTWithEjsTemplate,
  getLocalMaterials,
} from '@/webview/service';
import useService from './useService';

const useController = () => {
  const params = useParams<{ name: string }>();
  const service = useService();
  const { model } = service;
  const form = useForm();

  useEffect(() => {
    getLocalMaterials('snippets').then((data) => {
      if (data.length) {
        const selected = data.find((s) => s.name === params.name);
        if (selected && !selected.preview.schema) {
          selected.preview.schema = 'form-render';
        }
        model.setFormData(selected?.model);
        model.setSelectedMaterial(selected!);
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

  return {
    service,
    menu,
    form,
    watch,
    handleAskChatGPT,
  };
};

export default useController;
