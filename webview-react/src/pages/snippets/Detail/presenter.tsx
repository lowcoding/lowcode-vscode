import React, { useEffect } from 'react';
import { useParams } from 'umi';
import { Menu, message } from 'antd';
import { useForm } from 'form-render';
import {
  askChatGPTWithEjsTemplate,
  getLocalMaterials,
} from '@/webview/service';
import Service from './service';
import { useModel } from './model';

export const usePresenter = () => {
  const params = useParams<{ name: string }>();
  const model = useModel();
  const service = new Service(model);
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

  const handleRunScriptResult = (result: object) => {
    model.setSelectedMaterial((s) => ({
      ...s,
      model: result,
    }));
    model.setFormData(result);
    form.setValues(result);
    model.setScriptModalVisible(false);
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
    if (!model.selectedMaterial.viewPrompt) {
      message.warn('未配置 viewPrompt，直接输入 model');
    }
    askChatGPTWithEjsTemplate({
      template: model.selectedMaterial.viewPrompt || '<%- model %>',
      model: { model: JSON.stringify(model.selectedMaterial.model, null, 2) },
    });
  };

  return {
    model,
    service,
    menu,
    form,
    watch,
    handleAskChatGPT,
    handleRunScriptResult,
  };
};
