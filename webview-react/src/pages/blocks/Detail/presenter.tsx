import React, { useEffect } from 'react';
import { useParams } from 'umi';
import { useForm } from 'form-render';
import { message } from 'antd';
import Service from './service';
import { getLocalMaterials } from '@/webview/service';
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
        form.setValues(selected?.model);
      }
    });
  }, []);

  const watch = {
    '#': (val: any) => {
      model.setSelectedMaterial((s) => ({
        ...s,
        model: { ...s.model, ...JSON.parse(JSON.stringify(val)) },
      }));
    },
  };

  const handleRunScriptResult = (result: {
    /** 立即更新 model */
    updateModelImmediately: boolean;
    model: object;
  }) => {
    if (result.updateModelImmediately) {
      model.setSelectedMaterial((s) => ({
        ...s,
        model: result.model,
      }));
      form.setValues(result.model);
      if (
        model.selectedMaterial.preview.schema === 'amis' &&
        model.amisComponent.current
      ) {
        model.amisComponent.current!.setValues(result.model);
      }
      model.setScriptModalVisible(false);
      message.success('执行成功');
    } else {
      message.success('执行成功');
      model.setTempFormDataModal((s) => {
        s.visible = true;
        s.formData = result.model;
      });
    }
  };

  const handleUpdateModelOpen = () => {
    if (
      model.selectedMaterial.preview.schema === 'amis' &&
      model.amisComponent.current
    ) {
      model.setSelectedMaterial((s) => {
        s.model = model.amisComponent.current!.getValues();
      });
      model.setTempFormDataModal((s) => {
        s.visible = true;
        s.formData = model.amisComponent.current!.getValues();
      });
      return;
    }
    model.setTempFormDataModal((s) => {
      s.visible = true;
      s.formData = JSON.parse(JSON.stringify(model.selectedMaterial.model));
    });
  };

  const handleUpdateModelOk = () => {
    model.setSelectedMaterial((s) => ({
      ...s,
      model: JSON.parse(JSON.stringify(model.tempFormDataModal.formData)),
    }));
    form.setValues(
      JSON.parse(JSON.stringify(model.tempFormDataModal.formData)),
    );
    if (
      model.selectedMaterial.preview.schema === 'amis' &&
      model.amisComponent.current
    ) {
      model.amisComponent.current!.setValues(
        JSON.parse(JSON.stringify(model.tempFormDataModal.formData)),
      );
    }
    model.setTempFormDataModal((s) => {
      s.visible = false;
    });
    model.setScriptModalVisible(false);
  };

  const handleUpdateModelCancel = () => {
    model.setTempFormDataModal((s) => {
      s.visible = false;
    });
  };

  return {
    model,
    service,
    form,
    watch,
    handleRunScriptResult,
    handleUpdateModelOpen,
    handleUpdateModelOk,
    handleUpdateModelCancel,
  };
};
