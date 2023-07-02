import { useEffect } from 'react';
import { useParams, useModel as useUmiModel } from 'umi';
import { message } from 'antd';
import { defaultSchema, useModel } from './model';
import Service from './service';
import { addSnippets } from '@/webview/service';

export const usePresenter = () => {
  const model = useModel();
  const service = new Service(model);
  const syncFolderModal = useUmiModel('syncFolder');

  const params = useParams<{ time: string }>();

  useEffect(() => {
    model.setFormData((s) => ({
      ...s,
      template: localStorage.getItem('addSnippets') || '<%= name %>',
    }));
    // localStorage.removeItem('addSnippets');
  }, [params.time]);

  useEffect(() => {
    if (model.formData.schemaType === 'amis') {
      model.setFormData((s) => {
        s.model = defaultSchema.amis.model;
        s.schema = defaultSchema.amis.schema;
        s.preview = JSON.stringify(
          { ...JSON.parse(s.preview), schema: 'amis' },
          null,
          2,
        );
      });
    } else if (model.formData.schemaType === 'form-render') {
      model.setFormData((s) => {
        s.model = defaultSchema.formRender.model;
        s.schema = defaultSchema.formRender.schema;
        s.preview = JSON.stringify(
          { ...JSON.parse(s.preview), schema: 'form-render' },
          null,
          2,
        );
      });
    } else if (model.formData.schemaType === 'formily') {
      model.setFormData((s) => {
        s.model = defaultSchema.formily.model;
        s.schema = defaultSchema.formily.schema;
        s.preview = JSON.stringify(
          { ...JSON.parse(s.preview), schema: 'formily' },
          null,
          2,
        );
      });
    }
  }, [model.formData.schemaType]);

  const handleCreate = () => {
    if (!model.formData.name || !model.formData.template) {
      message.error('请完善必填信息');
      return;
    }
    addSnippets(model.formData).then((res) => {
      if (res.code === 200) {
        message.success('添加成功');
      } else if (res.code === 404) {
        message.error('请先配置私有目录');
        syncFolderModal.setVisible(true);
      }
    });
  };

  return {
    model,
    service,
    handleCreate,
  };
};
