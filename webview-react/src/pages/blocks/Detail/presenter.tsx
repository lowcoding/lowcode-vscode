import React, { useEffect } from 'react';
import { Menu, message } from 'antd';
import { useParams } from 'umi';
import { useForm } from 'form-render';
import Service from './service';
import {
  askChatGPTWithEjsTemplate,
  getLocalMaterials,
} from '@/webview/service';
import { useModel } from './model';

export const usePresenter = () => {
  const model = useModel();
  const service = new Service(model);
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

  const handleRunScriptResult = (result: object) => {
    model.setSelectedMaterial((s) => ({
      ...s,
      model: result,
    }));
    model.setData(result);
    form.setValues(result);
    model.setScriptModalVisible(false);
  };

  const handleAskChatGPT = () => {
    if (!model.selectedMaterial.viewPrompt) {
      message.warn('未配置 viewPrompt，直接输入 model');
    }
    askChatGPTWithEjsTemplate({
      template: model.selectedMaterial.viewPrompt || '<%- model %>',
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
    model,
    service,
    menu,
    form,
    watch,
    handleAskChatGPT,
    handleRunScriptResult,
  };
};
