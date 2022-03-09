import React, { useEffect } from 'react';
import { message } from 'antd';
import { useForm } from 'form-render';
import { createProject, selectDirectory } from '@/webview/service';
import { defaultConfig } from './useModel';
import useService from './useService';

const useController = (props: {
  visible: boolean;
  config: {
    formSchema?: { schema?: object; formData?: object; [key: string]: any };
  };
  onClose: (ok?: boolean) => void;
}) => {
  const service = useService();
  const { model } = service;
  const form = useForm();

  useEffect(() => {
    if (props.visible) {
      model.setFormData(props.config.formSchema?.formData || {});
      form.setValues(props.config.formSchema?.formData || {});
      model.setConfig(defaultConfig);
    }
  }, [props.visible]);

  const watch = {
    '#': (val: any) => {
      model.setFormData(JSON.parse(JSON.stringify(val)));
    },
  };

  const selectDirectoryByVsCode = () => {
    selectDirectory().then((res) => {
      model.setConfig((s) => {
        s.createDir = res;
      });
    });
  };

  const createProjectByVsCode = () => {
    if (!model.config.projectName) {
      message.error('请输入项目名称');
      return;
    }
    if (!model.config.createDir) {
      message.error('请选择生成目录');
      return;
    }
    createProject({
      model: {
        ...model.formData,
        projectName: model.config.projectName,
      },
      immediateOpen: model.config.immediateOpen,
      createDir: `${model.config.createDir}/${model.config.projectName}`,
    }).then(() => {
      message.success('创建成功');
      props.onClose(true);
    });
  };

  return {
    service,
    selectDirectoryByVsCode,
    createProjectByVsCode,
    form,
    watch,
  };
};

export default useController;
