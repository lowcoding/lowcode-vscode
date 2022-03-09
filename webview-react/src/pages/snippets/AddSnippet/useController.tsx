import React, { useEffect } from 'react';
import { useParams } from 'umi';
import useService from './useService';

const useController = () => {
  const service = useService();
  const { model } = service;

  const params = useParams<{ time: string }>();

  useEffect(() => {
    model.setFormData((s) => ({
      ...s,
      template: localStorage.getItem('addSnippets') || '',
    }));
  }, [params.time]);

  return {
    service,
  };
};

export default useController;
