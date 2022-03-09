import React, { useEffect } from 'react';
import { message } from 'antd';
import useService from './useService';
import { downloadScaffoldByVsCode } from '@/webview/service';

const useController = (props: { visible: boolean; onClose: () => void }) => {
  const service = useService();
  const { model } = service;

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
    service,
    downloadScaffold,
  };
};

export default useController;
