import React, { useEffect } from 'react';
import { message } from 'antd';
import Service from './service';
import { downloadScaffoldByVsCode } from '@/webview/service';
import { useModel } from './model';

export const usePresenter = (props: {
  visible: boolean;
  onClose: () => void;
}) => {
  const model = useModel();
  const service = new Service(model);

  useEffect(() => {
    if (props.visible) {
      model.setFormData({} as any);
    }
  }, [props.visible]);

  const downloadScaffold = () => {
    if (!model.formData.type || !model.formData.url) {
      message.error('请完善信息');
      return;
    }
    model.setProcessing(true);
    downloadScaffoldByVsCode({
      type: model.formData.type,
      repository: model.formData.url,
    })
      .then((res) => {
        model.setFormModal((s) => {
          s.config = res;
          s.visible = true;
        });
      })
      .finally(() => {
        model.setProcessing(false);
      });
  };

  return {
    model,
    service,
    downloadScaffold,
  };
};
