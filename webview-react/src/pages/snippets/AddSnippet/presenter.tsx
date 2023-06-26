import { useEffect } from 'react';
import { useParams } from 'umi';
import { defaultSchema, useModel } from './model';
import Service from './service';

export const usePresenter = () => {
  const model = useModel();
  const service = new Service(model);

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

  return {
    model,
    service,
  };
};